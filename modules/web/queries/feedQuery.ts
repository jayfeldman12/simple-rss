import {gql} from 'graphql-request';

export const FeedQuery = gql`
  query FeedQuery($username: String!, $onlyUnread: Boolean) {
    feeds(username: $username) {
      __typename
      description
      title
      url
      _id
      rssUrl
      feedItems(onlyUnread: $onlyUnread) {
        __typename
        url
        title
        description
        date
        id
        isRead
        image
      }
    }
  }
`;

export const MarkRead = gql`
  mutation MarkRead($username: String!, $feeds: [MarkReadFeed!]!) {
    markRead(username: $username, feeds: $feeds) {
      count
    }
  }
`;
