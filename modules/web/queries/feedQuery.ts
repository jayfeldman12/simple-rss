import {gql} from 'graphql-request';

export const FeedQuery = gql`
  query FeedQuery($username: String!, $onlyUnread: Boolean) {
    feeds(username: $username) {
      _id
      title
      feedItems(onlyUnread: $onlyUnread) {
        date
        description
        feedId
        id
        image
        isRead
        title
        url
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
