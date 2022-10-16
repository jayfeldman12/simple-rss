import {Config} from 'apollo-server-nextjs';
import {FeedApi} from './datasources/feedApi';
import {
  Feed,
  FeedItem,
  MutationAddFeedArgs,
  MutationDeleteFeedArgs,
  MutationLoginArgs,
  MutationMarkReadArgs,
} from './models/types';
import UsersApi from './datasources/usersApi';
import {JWTToken} from './models/jwtToken';
import {ObjectId} from 'mongodb';
import {Logger} from './logger';

type RequestContext = JWTToken & {
  dataSources: {
    feedApi: FeedApi;
    usersApi: UsersApi;
  };
};

export const resolvers: Config['resolvers'] = {
  Query: {
    feeds: async (_parent, args, {userId: id, dataSources}: RequestContext) => {
      Logger.log('Hitting get feeds');
      const response =
        (await dataSources.usersApi.getUser(id))?.feeds.filter(feed =>
          args.feedId ? args.feedId === feed._id.toString() : true,
        ) ?? [];
      Logger.log('Finished getting feeds');
      return response;
    },
  },
  Mutation: {
    createUser: (
      _parent,
      {username, password}: MutationLoginArgs,
      {dataSources}: RequestContext,
    ) => dataSources.usersApi.createUser(username, password),
    login: (
      _parent,
      {username, password}: MutationLoginArgs,
      {dataSources}: RequestContext,
    ) => dataSources.usersApi.login(username, password),
    addFeed: (
      _parent,
      {url, rssUrl}: MutationAddFeedArgs,
      {dataSources, userId}: RequestContext,
    ) => dataSources.usersApi.addFeed(url, dataSources.feedApi, userId, rssUrl),
    deleteFeed: (
      _parent,
      {feedId}: MutationDeleteFeedArgs,
      {dataSources, userId}: RequestContext,
    ) => dataSources.usersApi.deleteFeed(userId, new ObjectId(feedId)),
    markRead: (
      _parent,
      args: MutationMarkReadArgs,
      {userId: id, dataSources}: RequestContext,
    ) => {
      return dataSources.usersApi.markRead({...args, userId: id});
    },
    deleteUser: (_parent, _args, {userId, dataSources}: RequestContext) => {
      return dataSources.usersApi.deleteUser(userId);
    },
  },
  Feed: {
    feedItems: async (
      feed: Feed,
      args,
      {dataSources}: RequestContext,
    ): Promise<FeedItem[]> => {
      Logger.log('Getting a feed item', feed.url);
      const response = (
        await dataSources.feedApi.getItemsFromFeed(feed, args.onlyUnread)
      ).filter(x => x) as FeedItem[];
      Logger.log('Finished getting feed item', feed.url);
      return response;
    },
  },
};
