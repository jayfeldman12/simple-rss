import {GraphQLRequestContext} from 'apollo-server-types';
import {Config} from 'apollo-server-core';
import {FeedApi} from './datasources/feedApi';
import {Feed} from './__generated__/types';

type RequestContext = {
  dataSources: {
    feedApi: FeedApi;
  };
};

export const resolvers: Config['resolvers'] = {
  Query: {
    feeds: (_parent, _args, {dataSources}: RequestContext) => {
      const feeds = dataSources.feedApi.getAllFeeds();

      return feeds.map(dataSources.feedApi.getFeedInfo);
    },
  },
  Feed: {
    feedItems: (feed: Feed, _args, {dataSources}: RequestContext) =>
      dataSources.feedApi.getFeedItems(feed.rssUrl ?? ''),
  },
};
