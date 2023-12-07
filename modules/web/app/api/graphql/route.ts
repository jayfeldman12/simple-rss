import {ApolloServer} from '@apollo/server';
import {startServerAndCreateNextHandler} from '@as-integrations/next';

import {ObjectId} from 'mongodb';

import jwt from 'jsonwebtoken';
import {NextRequest} from 'next/server';
import {logger} from './logger';
import {JWTToken} from './models/jwtToken';
import {resolvers} from './resolvers';
import {typeDefs} from './schema';

const PUBLIC_ENDPOINTS = ['createUser', 'login'];

const server = new ApolloServer({
  cache: 'bounded',
  typeDefs,
  resolvers,
  plugins: [logger],
});

const handler = startServerAndCreateNextHandler<
  NextRequest,
  {userId: ObjectId}
>(server, {
  context: async (req, res) => {
    const token = req.headers.get('authorization')?.split('Bearer ')[1] ?? '';
    if (!token) {
      return {req, res, userId: new ObjectId('')};
    }
    let rawToken: JWTToken = jwt.verify(
      token,
      process.env.JWT_SIGNING!,
    ) as JWTToken;

    return {req, res, userId: new ObjectId(rawToken?.userId)};
  },
});

export {handler as GET, handler as POST};
