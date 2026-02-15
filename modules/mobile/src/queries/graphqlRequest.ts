import AsyncStorage from '@react-native-async-storage/async-storage';
import {request, type RequestDocument, type Variables} from 'graphql-request';
import {TOKEN_LOCAL_STORAGE} from './consts';

const ENDPOINT = 'https://simple-rss-omega.vercel.app/api/graphql';

export const graphqlRequest = async <R>(
  query: RequestDocument,
  variables: Variables,
) => {
  const token = await AsyncStorage.getItem(TOKEN_LOCAL_STORAGE);
  const headers: Record<string, string> = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return request<R>(ENDPOINT, query, variables, headers);
};
