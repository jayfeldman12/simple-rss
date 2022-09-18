import {Config} from 'apollo-server-nextjs';
import {FeedApi} from './datasources/feedApi';
import {
  Feed,
  FeedItem,
  MutationLoginArgs,
  MutationMarkReadArgs,
  QueryFeedsArgs,
} from './models/types';
import UsersApi from './datasources/usersApi';
import {JWTToken} from './models/jwtToken';

type RequestContext = JWTToken & {
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
    markRead: (
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
