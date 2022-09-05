import {gql} from 'apollo-server';

export const typeDefs = gql`
  type Query {
    "Get all fields user has subscribed to"
    feeds: [Feed]
    "If passed in a feed ID, return all RSS items for that feed. Otherwise, return all feeds items"
    feedItems: [FeedItem]
  }

  "A URL users subscribe to for RSS feeds"
  type Feed {
    description: String
    feedItems: [FeedItem]
    id: ID!
    "A list of IDs on this feed a user has read. Used to highlight unread items"
    reads: [ID]
    """
    URL of the RRS feed, can be used to get new items. If empty or erroring, this will be fetched from the main URL.
    """
    rssUrl: String
    title: String
    "URL of the main site"
    url: String!
  }

  "RSS feed item"
  type FeedItem {
    date: String!
    description: String
    id: ID!
    title: String
    url: String!
  }
`;
