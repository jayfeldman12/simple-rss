import {Config} from 'apollo-server-core';
import {FeedApi} from './datasources/feedApi';
import {Feed, FeedItem, FeedItemImage} from './models/types';
import UsersApi from './datasources/usersApi';
import {onlyDefined} from '../utils/onlyDefined';

type RequestContext = {
  dataSources: {
    feedApi: FeedApi;
    usersApi: UsersApi;
  };
};

export const resolvers: Config['resolvers'] = {
  Query: {
    feeds: async (_parent, args, {dataSources}: RequestContext) => {
      return (await dataSources.usersApi.getUser(args.username))?.feeds ?? [];
    },
  },
  Mutation: {
    markRead: async (_parent, args, {dataSources}: RequestContext) =>
      dataSources.usersApi.markRead(
        args.username,
        args.feedId,
        args.feedItemId,
      ),
  },
  Feed: {
    feedItems: async (
      feed: Feed,
      args,
      {dataSources}: RequestContext,
    ): Promise<Omit<FeedItem, 'feedItemImage'>[]> => {
      return onlyDefined(
        await dataSources.feedApi.getItemsFromFeed(feed, args.onlyUnread),
      );
    },
  },
  FeedItem: {
    feedItemImage: async (
      feedItem: FeedItem,
      _args,
      {dataSources}: RequestContext,
    ): Promise<FeedItemImage> => {
      return dataSources.feedApi.getImageFromItem(feedItem);
    },
  },
};
