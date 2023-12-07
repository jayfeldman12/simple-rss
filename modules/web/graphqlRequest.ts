import {request, RequestDocument, Variables} from 'graphql-request';
import {TOKEN_LOCAL_STORAGE} from './app/api/graphql/consts';

const ENDPOINT = '/api/graphql';

export const graphqlRequest = <R>(
  query: RequestDocument,
  variables: Variables,
) => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);
  const headers: Record<string, string> = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return request<R>(ENDPOINT, query, variables, headers);
};
