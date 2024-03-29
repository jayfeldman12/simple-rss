import {gql} from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    "Get all fields user has subscribed to"
    feeds(feedId: String): [Feed]
  }

  type Mutation {
    createUser(username: String!, password: String!): CreateUserResponse
    login(username: String!, password: String!): LoginResponse
    addFeed(url: String!, rssUrl: String): AddFeedResponse
    deleteFeed(feedId: String!): DeleteFeedResponse
    markRead(feeds: [MarkReadFeed!]!): MarkReadResponse
    deleteUser: DeleteUserResponse
  }

  type CreateUserResponse {
    token: String!
    id: String!
  }

  type LoginResponse {
    token: String!
  }

  type AddFeedResponse {
    id: String!
  }

  type DeleteFeedResponse {
    id: String!
  }

  type MarkReadResponse {
    count: Int!
  }

  type DeleteUserResponse {
    id: String!
  }

  input MarkReadFeed {
    id: String!
    feedItemIds: [String!]!
  }

  "A URL users subscribe to for RSS feeds"
  type Feed {
    "A list of IDs on this feed a user has read. Used to highlight unread items"
    _id: ID!
    icon: String
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

  type User {
    username: String!
    _id: ID!
    feeds: [FeedItem]!
  }
`;
