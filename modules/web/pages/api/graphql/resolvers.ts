import {Config} from 'apollo-server-nextjs';
import {FeedApi} from './datasources/feedApi';
import {
  Feed,
  FeedItem,
  MutationMarkReadArgs,
  QueryFeedsArgs,
} from './models/types';
import UsersApi from './datasources/usersApi';

type RequestContext = {
  dataSources: {
    feedApi: FeedApi;
    usersApi: UsersApi;
  };
};

export const resolvers: Config['resolvers'] = {
  Query: {
    feeds: async (
      _parent,
      args: QueryFeedsArgs,
      {dataSources}: RequestContext,
    ) => {
      return (await dataSources.usersApi.getUser(args.username))?.feeds ?? [];
    },
  },
  Mutation: {
    markRead: async (
      _parent,
      args: MutationMarkReadArgs,
      {dataSources}: RequestContext,
    ) => {
      return dataSources.usersApi.markRead(args);
    },
  },
  Feed: {
    feedItems: async (
      feed: Feed,
      args,
      {dataSources}: RequestContext,
    ): Promise<FeedItem[]> => {
      return (
        await dataSources.feedApi.getItemsFromFeed(feed, args.onlyUnread)
      ).filter(x => x) as FeedItem[];
    },
  },
};
