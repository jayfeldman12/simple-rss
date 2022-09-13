import {gql} from 'apollo-server-nextjs';

export const typeDefs = gql`
  type Query {
    "Get all fields user has subscribed to"
    feeds(username: String!): [Feed]
  }

  type Mutation {
    markRead(username: String!, feeds: [MarkReadFeed!]!): MarkReadResponse
  }

  type MarkReadResponse {
    count: Int!
  }

  input MarkReadFeed {
    id: String!
    feedItemIds: [String!]!
  }

  "A URL users subscribe to for RSS feeds"
  type Feed {
    "A list of IDs on this feed a user has read. Used to highlight unread items"
    _id: ID!
    description: String
    feedItems(onlyUnread: Boolean): [FeedItem!]!
    reads: [ID!]
    """
    URL of the RRS feed, can be used to get new items. If empty or erroring, this will be fetched from the main URL.
    """
    rssUrl: String!
    title: String
    "URL of the main site"
    url: String!
  }

  "RSS feed item"
  type FeedItem {
    date: String!
    description: String
    feedId: String!
    id: ID!
    image: String
    isRead: Boolean!
    title: String
    url: String!
  }
`;
