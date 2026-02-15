import dotenv from 'dotenv';
import {FeedApi} from './datasources/feedApi';
import {
  Feed,
  FeedItem,
  MutationAddFeedArgs,
  MutationDeleteFeedArgs,
  MutationLoginArgs,
  MutationMarkReadArgs,
} from './models/types';

import {ApolloServerOptionsWithTypeDefs} from '@apollo/server';
import {MongoClient, ObjectId} from 'mongodb';
import UsersApi from './datasources/usersApi';
import {Logger} from './logger';

// If on prod, this env variable should be already set by the build.
// Otherwise,this sets locally from a .env file
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

const mongoClient = new MongoClient(process.env.MONGODB_URI ?? '');

mongoClient.connect();
const feedApi = new FeedApi();
const usersApi = new UsersApi(mongoClient.db().collection('users'));

type RequestContext = {userId?: ObjectId};

const NOT_LOGGED_IN = 'Missing ID';

export const resolvers: ApolloServerOptionsWithTypeDefs<RequestContext>['resolvers'] =
  {
    Query: {
      feeds: async (_parent, args, {userId}: RequestContext) => {
        if (!userId) {
          throw new Error(NOT_LOGGED_IN);
        }
        Logger.log('Hitting get feeds');
        const response =
          (await usersApi.getUser(userId, feedApi))?.feeds.filter(feed =>
            args.feedId ? args.feedId === feed._id.toString() : true,
          ) ?? [];
        Logger.log('Finished getting feeds');
        return response;
      },
    },
    Mutation: {
      createUser: (_parent, {username, password}: MutationLoginArgs) =>
        usersApi.createUser(username, password),
      login: (_parent, {username, password}: MutationLoginArgs) =>
        usersApi.login(username, password),
      addFeed: (
        _parent,
        {url, rssUrl}: MutationAddFeedArgs,
        {userId}: RequestContext,
      ) => {
        if (!userId) {
          throw new Error(NOT_LOGGED_IN);
        }
        return usersApi.addFeed(url, feedApi, userId, rssUrl);
      },

      deleteFeed: (
        _parent,
        {feedId}: MutationDeleteFeedArgs,
        {userId}: RequestContext,
      ) => {
        if (!userId) {
          throw new Error(NOT_LOGGED_IN);
        }
        return usersApi.deleteFeed(userId, feedId);
      },
      markRead: (
        _parent,
        args: MutationMarkReadArgs,
        {userId}: RequestContext,
      ) => {
        if (!userId) {
          throw new Error(NOT_LOGGED_IN);
        }
        return usersApi.markRead({...args, userId});
      },
      deleteUser: (_parent, _args, {userId}: RequestContext) => {
        if (!userId) {
          throw new Error(NOT_LOGGED_IN);
        }
        return usersApi.deleteUser(userId);
      },
    },
    Feed: {
      feedItems: async (feed: Feed, args): Promise<FeedItem[]> => {
        const response = await feedApi.getItemsFromFeed(feed, args.onlyUnread);
        return response;
      },
    },
  };
