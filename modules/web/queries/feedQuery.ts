export const FeedQuery = `
  query FeedQuery ($username: String!, $onlyUnread: Boolean) {
    feeds(username: $username) {
      description
      title
      url
      _id
      rssUrl
      feedItems (onlyUnread: $onlyUnread){
        url
        title
        id
        isRead
      }
    }
  }
`;

export const MarkRead = `
mutation MarkRead($username: String!, $feedId: String!, $feedItemId: String!) {
  markRead(username: $username, feedId: $feedId, feedItemId: $feedItemId) {
    success
  }
}
`;
