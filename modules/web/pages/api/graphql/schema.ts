import {gql} from 'apollo-server-nextjs';

export const typeDefs = gql`
  type Query {
    "Get all fields user has subscribed to"
    feeds(username: String!): [Feed]
  }

  type Mutation {
    markRead(
      username: String!
      feedId: String!
      feedItemId: String!
    ): MarkReadResponse
  }

  type MarkReadResponse {
    success: Boolean!
  }

  "A URL users subscribe to for RSS feeds"
  type Feed {
    description: String
    feedItems(onlyUnread: Boolean): [FeedItem]
    _id: ID!
    "A list of IDs on this feed a user has read. Used to highlight unread items"
    reads: [ID]
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
    id: ID!
    title: String
    url: String!
    isRead: Boolean!
    feedItemImage: FeedItemImage
  }

  type FeedItemImage {
    imgSrc: String
  }
`;
