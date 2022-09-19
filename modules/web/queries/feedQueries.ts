import {gql} from 'graphql-request';

export const FeedQuery = gql`
  query FeedQuery($onlyUnread: Boolean) {
    feeds {
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
  mutation MarkRead($feeds: [MarkReadFeed!]!) {
    markRead(feeds: $feeds) {
      count
    }
  }
`;
