import {request, RequestDocument} from 'graphql-request';

const ENDPOINT = '/api/graphql';

export const graphqlRequest = (query: RequestDocument, variables: unknown) => {
  return request(ENDPOINT, query, variables);
};
