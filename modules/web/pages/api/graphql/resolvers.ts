import {Config} from 'apollo-server-nextjs';
import {FeedApi} from './datasources/feedApi';
import {
  Feed,
  FeedItem,
  MutationLoginArgs,
  MutationMarkReadArgs,
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
      _args,
      {userId: id, dataSources}: RequestContext,
    ) => {
      return (await dataSources.usersApi.getUser(id))?.feeds ?? [];
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
      {userId: id, dataSources}: RequestContext,
    ) => {
      return dataSources.usersApi.markRead({...args, userId: id});
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
