import {ApolloServer} from 'apollo-server-nextjs';
import {typeDefs} from './schema';
import {resolvers} from './resolvers';
import {FeedApi} from './datasources/feedApi';
import {logger} from './logger';
import {MongoClient} from 'mongodb';
import UsersApi from './datasources/usersApi';
import dotenv from 'dotenv';

// If on prod, this env variable should be already set by the build.
// Otherwise,this sets locally from a .env file
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

const mongoClient = new MongoClient(process.env.MONGODB_URI ?? '');
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
  plugins: [logger],
});

export default server.createHandler();

export const config = {
  api: {
    bodyParser: false,
  },
};
