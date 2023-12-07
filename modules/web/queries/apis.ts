import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  AddFeedResponse,
  CreateUserResponse,
  DeleteFeedResponse,
  DeleteUserResponse,
  Feed,
  LoginResponse,
  MarkReadResponse,
  MutationAddFeedArgs,
  MutationCreateUserArgs,
  MutationDeleteFeedArgs,
  MutationLoginArgs,
  MutationMarkReadArgs,
} from '../app/api/graphql/models/types';
import {graphqlRequest} from '../graphqlRequest';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {FeedQuery, MarkRead} from './feedQueries';
import {AddFeed, DeleteFeed, DeleteUser, Login} from './userQueries';

type FeedResponse = {
  feeds: Feed[];
};

type GetFeedOptions = {
  fetchAll?: boolean;
  feedId?: string;
  isSidebar?: boolean;
};

type MutationOptions<Response, Args> =
  | Omit<UseMutationOptions<Response, Error, Args, unknown>, 'mutationFn'>
  | undefined;

type QueryOptions<Response> = Omit<
  UseQueryOptions<Response, Error, Response, QueryKey>,
  'queryKey' | 'queryFn' | 'initialData'
>;

export const getFeedKey = (token?: string, options?: GetFeedOptions) => [
  'getFeeds',
  token,
  options,
];

export const useGetFeeds = (
  token?: string,
  feedOptions: GetFeedOptions = {},
  options?: QueryOptions<FeedResponse>,
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
  options?: MutationOptions<MarkReadResponse, MutationMarkReadArgs>,
) => {
  return useMutation(
    ['markRead'],
    (variables: MutationMarkReadArgs) =>
      graphqlRequest<MarkReadResponse>(MarkRead, {...variables}),
    options,
  );
};

export const useAddFeed = (
  options?: MutationOptions<AddFeedResponse, MutationAddFeedArgs>,
) => {
  return useMutation<AddFeedResponse, Error, MutationAddFeedArgs>(
    async (variables: MutationAddFeedArgs) =>
      graphqlRequest(AddFeed, {...variables}),
    options,
  );
};

export const useDeleteFeed = (
  options?: MutationOptions<DeleteFeedResponse, MutationDeleteFeedArgs>,
) => {
  return useMutation(
    (variables: MutationDeleteFeedArgs) =>
      graphqlRequest<DeleteFeedResponse>(DeleteFeed, {...variables}),
    options,
  );
};

export const useDeleteUser = (
  options?: MutationOptions<DeleteUserResponse, void>,
) => {
  return useMutation(() => graphqlRequest(DeleteUser, {}));
};

export const useLogin = (
  options?: MutationOptions<LoginResponse, MutationLoginArgs>,
) => {
  return useMutation<LoginResponse, Error, MutationLoginArgs>(
    async (variables: MutationLoginArgs) =>
      graphqlRequest(Login, {...variables}),
    options,
  );
};

export const useCreateAccount = (
  options?: MutationOptions<CreateUserResponse, MutationCreateUserArgs>,
) => {
  return useMutation<CreateUserResponse, Error, MutationCreateUserArgs>(
    async (variables: MutationCreateUserArgs) =>
      graphqlRequest(Login, {...variables}),
    options,
  );
};
