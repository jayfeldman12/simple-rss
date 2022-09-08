export const FeedQuery = `
  query FeedQuery ($username: String!) {
    feeds(username: $username) {
      description
      title
      url
      _id
      rssUrl
      feedItems {
        url
        title
        id
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
