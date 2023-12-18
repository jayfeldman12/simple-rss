import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQueries,
  useQuery,
} from '@tanstack/react-query';
import {
  AddFeedResponse,
  CreateUserResponse,
  DeleteFeedResponse,
  DeleteUserResponse,
  Feed,
  LoginResponse as LoginResponseModel,
  MarkReadResponse,
  MutationAddFeedArgs,
  MutationCreateUserArgs,
  MutationDeleteFeedArgs,
  MutationLoginArgs,
  MutationMarkReadArgs,
} from '../app/api/graphql/models/types';
import {graphqlRequest} from '../graphqlRequest';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {FeedQuery, ListFeeds, MarkRead} from './feedQueries';
import {AddFeed, DeleteFeed, DeleteUser, Login} from './userQueries';

export type FeedResponse = {
  feeds: Feed[];
};

export type FeedListResponse = {
  feeds: Array<{
    _id: string;
    icon: string;
    title: string;
  }>;
};

type LoginResponse = {
  login: LoginResponseModel;
};

type GetFeedOptions = {
  fetchAll?: boolean;
  feedId?: string;
};

type GetFeedsOptions = {
  fetchAll?: boolean;
  feedIds: string[];
};

type MutationOptions<Response, Args> =
  | Omit<UseMutationOptions<Response, Error, Args, unknown>, 'mutationFn'>
  | undefined;

type QueryOptions<Response> = Omit<
  UseQueryOptions<Response, Error, Response, QueryKey>,
  'queryKey' | 'queryFn' | 'initialData'
>;

export const getFeedKey = (options?: GetFeedOptions) => ['getFeeds', options];

export const useGetFeeds = (
  feedOptions: GetFeedsOptions = {feedIds: []},
  options?: QueryOptions<FeedResponse>,
) => {
  const {fetchAll, feedIds} = feedOptions;
  return useQueries({
    queries: feedIds.map(feedId => getFeed({fetchAll, feedId}, options)),
  }) as UseQueryResult<FeedResponse, Error>[];
};

export const useGetFeed = (
  feedOptions: GetFeedOptions = {},
  options?: QueryOptions<FeedResponse>,
) => {
  const {queryKey, queryFn, ...queryOptions} = getFeed(feedOptions, options);
  return useQuery<FeedResponse, Error>({queryKey, queryFn, ...queryOptions});
};

const getFeed = (
  feedOptions: GetFeedOptions = {},
  options?: QueryOptions<FeedResponse>,
): UseQueryOptions<FeedResponse, Error> => {
  const {feedId, fetchAll} = feedOptions;
  return {
    queryKey: getFeedKey(feedOptions),
    queryFn: () =>
      graphqlRequest<FeedResponse>(FeedQuery, {
        feedId,
        onlyUnread: !fetchAll,
      }),
    refetchInterval: APP_FEED_REFRESH_TIME + 10, // make sure it's not marked as stale
    refetchIntervalInBackground: true,
    staleTime: APP_FEED_REFRESH_TIME,
    ...options,
  };
};

export const useListFeeds = (options?: QueryOptions<FeedListResponse>) => {
  return useQuery<FeedListResponse, Error>({
    queryKey: ['listFeeds'],
    queryFn: () => graphqlRequest(ListFeeds, {}),
    ...options,
  });
};

export const useMarkRead = (
  options?: MutationOptions<MarkReadResponse, MutationMarkReadArgs>,
) => {
  return useMutation({
    mutationKey: ['markRead'],
    mutationFn: (variables: MutationMarkReadArgs) =>
      graphqlRequest<MarkReadResponse>(MarkRead, {...variables}),
    ...options,
  });
};

export const useAddFeed = (
  options?: MutationOptions<AddFeedResponse, MutationAddFeedArgs>,
) => {
  return useMutation<AddFeedResponse, Error, MutationAddFeedArgs>({
    mutationFn: async (variables: MutationAddFeedArgs) =>
      graphqlRequest(AddFeed, {...variables}),
    ...options,
  });
};

export const useDeleteFeed = (
  options?: MutationOptions<DeleteFeedResponse, MutationDeleteFeedArgs>,
) => {
  return useMutation({
    mutationFn: (variables: MutationDeleteFeedArgs) =>
      graphqlRequest<DeleteFeedResponse>(DeleteFeed, {...variables}),
    ...options,
  });
};

export const useDeleteUser = (
  options?: MutationOptions<DeleteUserResponse, void>,
) => {
  return useMutation({
    mutationFn: () => graphqlRequest<DeleteUserResponse>(DeleteUser, {}),
    ...options,
  });
};

export const useLogin = (
  options?: MutationOptions<LoginResponse, MutationLoginArgs>,
) => {
  return useMutation<LoginResponse, Error, MutationLoginArgs>({
    mutationFn: async (variables: MutationLoginArgs) =>
      graphqlRequest(Login, {...variables}),
    ...options,
  });
};

export const useCreateAccount = (
  options?: MutationOptions<CreateUserResponse, MutationCreateUserArgs>,
) => {
  return useMutation<CreateUserResponse, Error, MutationCreateUserArgs>({
    mutationFn: async (variables: MutationCreateUserArgs) =>
      graphqlRequest(Login, {...variables}),
    ...options,
  });
};
