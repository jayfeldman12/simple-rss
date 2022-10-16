import {graphqlRequest} from '../graphqlRequest';
import {
  AddFeedResponse,
  DeleteFeedResponse,
  DeleteUserResponse,
  Feed,
  MarkReadResponse,
  MutationAddFeedArgs,
  MutationDeleteFeedArgs,
  MutationMarkReadArgs,
} from '../pages/api/graphql/models/types';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {FeedQuery, MarkRead} from './feedQueries';
import {AddFeed, DeleteFeed, DeleteUser} from './userQueries';
import {
  QueryKey,
  useQuery,
  useMutation,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

type FeedResponse = {
  feeds: Feed[];
};

type GetFeedOptions = {
  fetchAll?: boolean;
  feedId?: string;
  isSidebar?: boolean;
};

export const getFeedKey = (token?: string, options?: GetFeedOptions) => [
  'getFeeds',
  token,
  options,
];

export const useGetFeeds = (
  token?: string,
  feedOptions: GetFeedOptions = {},
  options?: Omit<
    UseQueryOptions<FeedResponse, Error, FeedResponse, QueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  >,
) => {
  const {fetchAll, feedId} = feedOptions;
  return useQuery<FeedResponse, Error>(
    getFeedKey(token, feedOptions),
    () => graphqlRequest(FeedQuery, {onlyUnread: !fetchAll, feedId}),
    {
      refetchInterval: APP_FEED_REFRESH_TIME + 10, // make sure it's not marked as stale
      refetchIntervalInBackground: true,
      ...options,
    },
  );
};

export const useMarkRead = (
  options?:
    | Omit<
        UseMutationOptions<
          MarkReadResponse,
          Error,
          MutationMarkReadArgs,
          unknown
        >,
        'mutationFn'
      >
    | undefined,
) => {
  return useMutation(
    (variables: MutationMarkReadArgs) =>
      graphqlRequest(MarkRead, {...variables}),
    options,
  );
};

export const useAddFeed = (
  options?:
    | Omit<
        UseMutationOptions<
          AddFeedResponse,
          Error,
          MutationAddFeedArgs,
          unknown
        >,
        'mutationFn'
      >
    | undefined,
) => {
  return useMutation<AddFeedResponse, Error, MutationAddFeedArgs>(
    async (variables: MutationAddFeedArgs) =>
      graphqlRequest(AddFeed, {...variables}),
    options,
  );
};

export const useDeleteFeed = (
  options?:
    | Omit<
        UseMutationOptions<
          DeleteFeedResponse,
          Error,
          MutationDeleteFeedArgs,
          unknown
        >,
        'mutationFn'
      >
    | undefined,
) => {
  return useMutation(
    (variables: MutationDeleteFeedArgs) =>
      graphqlRequest(DeleteFeed, {...variables}),
    options,
  );
};

export const useDeleteUser = (
  options?:
    | Omit<
        UseMutationOptions<DeleteUserResponse, Error, void, unknown>,
        'mutationFn'
      >
    | undefined,
) => {
  return useMutation(() => graphqlRequest(DeleteUser, options));
};
