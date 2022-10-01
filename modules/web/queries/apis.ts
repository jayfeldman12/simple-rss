import {graphqlRequest} from '../graphqlRequest';
import {
  Feed,
  MutationAddFeedArgs,
  MutationDeleteFeedArgs,
  MutationMarkReadArgs,
} from '../pages/api/graphql/models/types';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {FeedQuery, MarkRead} from './feedQueries';
import {AddFeed, DeleteFeed, DeleteUser} from './userQueries';
import {useQuery, useMutation} from '@tanstack/react-query';

type FeedResponse = {
  feeds: Feed[];
};

export const getFeedKey = (
  token?: string,
  fetchAll?: boolean,
  feedId?: string,
) => ['getFeeds', token, {fetchAll, feedId}];

export const useGetFeeds = (
  token?: string,
  fetchAll?: boolean,
  feedId?: string,
) => {
  return useQuery<FeedResponse, Error>(
    getFeedKey(token, fetchAll, feedId),
    () => graphqlRequest(FeedQuery, {onlyUnread: !fetchAll, feedId}),
    {
      refetchInterval: APP_FEED_REFRESH_TIME + 10, // make sure it's not marked as stale
      refetchIntervalInBackground: true,
    },
  );
};

export const useMarkRead = () => {
  return useMutation((variables: MutationMarkReadArgs) =>
    graphqlRequest(MarkRead, {...variables}),
  );
};

export const useAddFeed = () => {
  return useMutation((variables: MutationAddFeedArgs) =>
    graphqlRequest(AddFeed, {...variables}),
  );
};

export const useDeleteFeed = () => {
  return useMutation((variables: MutationDeleteFeedArgs) =>
    graphqlRequest(DeleteFeed, {...variables}),
  );
};

export const useDeleteUser = () => {
  return useMutation(() => graphqlRequest(DeleteUser, {}));
};
