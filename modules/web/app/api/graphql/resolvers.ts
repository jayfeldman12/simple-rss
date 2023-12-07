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
const usersApi = new UsersApi({
  modelOrCollection: mongoClient.db().collection('users'),
});

type RequestContext = {userId: ObjectId};

export const resolvers: ApolloServerOptionsWithTypeDefs<RequestContext>['resolvers'] =
  {
    Query: {
      feeds: async (_parent, args, {userId}: RequestContext) => {
        Logger.log('Hitting get feeds');
        const response =
          (await usersApi.getUser(userId))?.feeds.filter(feed =>
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
      ) => usersApi.addFeed(url, feedApi, userId, rssUrl),
      deleteFeed: (
        _parent,
        {feedId}: MutationDeleteFeedArgs,
        {userId}: RequestContext,
      ) => usersApi.deleteFeed(userId, new ObjectId(feedId)),
      markRead: (
        _parent,
        args: MutationMarkReadArgs,
        {userId: id}: RequestContext,
      ) => {
        return usersApi.markRead({...args, userId: id});
      },
      deleteUser: (_parent, _args, {userId}: RequestContext) => {
        return usersApi.deleteUser(userId);
      },
    },
    Feed: {
      feedItems: async (feed: Feed, args): Promise<FeedItem[]> => {
        console.log('Starting get feed items');
        const response = await feedApi.getItemsFromFeed(feed, args.onlyUnread);
        return response;
      },
    },
  };
