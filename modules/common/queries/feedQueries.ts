import gql from 'graphql-tag';

export const FeedQuery = gql`
  query FeedQuery($onlyUnread: Boolean, $feedId: String) {
    feeds(feedId: $feedId) {
      _id
      icon
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

export const ListFeeds = gql`
  query ListFeeds {
    feeds {
      _id
      icon
      title
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
