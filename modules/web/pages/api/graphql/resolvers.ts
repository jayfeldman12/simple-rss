import {Config} from 'apollo-server-nextjs';
import {FeedApi} from './datasources/feedApi';
import {Feed, FeedItem, FeedItemImage} from './models/types';
import UsersApi from './datasources/usersApi';

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
      return (
        await dataSources.feedApi.getItemsFromFeed(feed, args.onlyUnread)
      ).filter(x => x) as FeedItem[];
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
