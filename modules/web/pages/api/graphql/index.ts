import {ApolloServer, AuthenticationError} from 'apollo-server-nextjs';
import {parse as parseGraphql} from 'graphql';
import {typeDefs} from './schema';
import {resolvers} from './resolvers';
import {FeedApi} from './datasources/feedApi';
import {logger} from './logger';
import {Logger, MongoClient, ObjectId} from 'mongodb';
import UsersApi from './datasources/usersApi';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import {JWTToken} from './models/jwtToken';
import {Errors} from '../../../errors';

// If on prod, this env variable should be already set by the build.
// Otherwise,this sets locally from a .env file
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

const PUBLIC_ENDPOINTS = ['createUser', 'login'];

const mongoClient = new MongoClient(process.env.MONGODB_URI ?? '');

Logger.setLevel('debug');
mongoClient.connect();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      feedApi: new FeedApi(),
      usersApi: new UsersApi(mongoClient.db().collection('users')),
    };
  },
  context: ({req}): JWTToken => {
    const gql = parseGraphql(req.body?.query);
    // Types are wrong on this
    const endpointName = (gql.definitions[0] as any).selectionSet.selections[0]
      .name.value;
    if (PUBLIC_ENDPOINTS.includes(endpointName)) return;

    const token = req.headers.authorization?.split('Bearer ')[1] ?? '';
    let rawToken: JWTToken;
    console.log('token', token);
    try {
      rawToken = jwt.verify(token, process.env.JWT_SIGNING!) as JWTToken;
      console.log('row', rawToken);
    } finally {
      if (!rawToken?.userId) {
        throw new AuthenticationError(Errors.UNAUTHORIZED);
      }
    }

    return {userId: new ObjectId(rawToken.userId)};
  },
  plugins: [logger],
});

export default server.createHandler();

export const config = {
  api: {
    bodyParser: false,
  },
};
