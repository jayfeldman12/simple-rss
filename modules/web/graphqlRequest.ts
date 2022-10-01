import {request, RequestDocument} from 'graphql-request';
import {TOKEN_LOCAL_STORAGE} from './pages/api/graphql/consts';

const ENDPOINT = '/api/graphql';

export const graphqlRequest = (query: RequestDocument, variables: unknown) => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);
  const headers: Record<string, string> = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return request(ENDPOINT, query, variables, headers);
};
