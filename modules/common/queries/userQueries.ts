import gql from 'graphql-tag';

export const Login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

export const CreateUser = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      token
    }
  }
`;

export const AddFeed = gql`
  mutation AddFeed($url: String!, $rssUrl: String) {
    addFeed(url: $url, rssUrl: $rssUrl) {
      id
    }
  }
`;

export const DeleteFeed = gql`
  mutation DeleteFeed($feedId: String!) {
    deleteFeed(feedId: $feedId) {
      id
    }
  }
`;

export const DeleteUser = gql`
  mutation DeleteUser {
    deleteUser {
      id
    }
  }
`;
