import {Config} from 'apollo-server-core';
import {FeedApi} from './datasources/feedApi';
import {Feed} from './models/types';
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
      const feeds =
        (await dataSources.usersApi.getFeedFromUser(args.username))?.feeds ??
        [];

      return feeds.map(feed =>
        dataSources.feedApi.getFeedInfo(feed, (rssLink, feedId) =>
          dataSources.usersApi.updateRssLinkForUser(
            rssLink,
            feedId,
            args.username,
          ),
        ),
      );
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
    feedItems: (feed: Feed, _args, {dataSources}: RequestContext) =>
      dataSources.feedApi.getFeedItems(feed.rssUrl ?? ''),
  },
};
