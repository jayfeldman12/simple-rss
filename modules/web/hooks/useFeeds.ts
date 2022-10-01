import {useCallback, useMemo, useState} from 'react';
import {
  Feed,
  FeedItem,
  MutationAddFeedArgs,
  MutationDeleteFeedArgs,
  MutationMarkReadArgs,
} from '../pages/api/graphql/models/types';
import {FeedQuery, MarkRead} from '../queries/feedQueries';
import {graphqlRequest} from '../graphqlRequest';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {AddFeed, DeleteFeed, DeleteUser} from '../queries/userQueries';
import {useTokenContext} from './tokenProvider';
import {Errors} from '../errors';

type FeedResponse = {
  feeds: Feed[];
};

export const useFeeds = (onLogout: () => void, feedId?: string) => {
  const {token, clearToken} = useTokenContext();
  const queryClient = useQueryClient();
  const [fetchAll, setFetchAll] = useState(false);
  const [locallyRead, setLocallyRead] = useState<string[]>([]);

  const {
    data: {feeds} = {},
    isSuccess,
    isFetching,
    error,
  } = useQuery<FeedResponse, Error>(
    ['getFeeds' + token + !fetchAll + feedId],
    () => graphqlRequest(FeedQuery, {onlyUnread: !fetchAll, feedId}),
    {
      refetchInterval: APP_FEED_REFRESH_TIME + 10, // make sure it's not marked as stale
      refetchIntervalInBackground: true,
    },
  );
  const {mutate: markRead} = useMutation((variables: MutationMarkReadArgs) =>
    graphqlRequest(MarkRead, {...variables}),
  );
  const {mutate: addFeedByUrl} = useMutation((variables: MutationAddFeedArgs) =>
    graphqlRequest(AddFeed, {...variables}),
  );
  const {mutate: deleteFeedById} = useMutation(
    (variables: MutationDeleteFeedArgs) =>
      graphqlRequest(DeleteFeed, {...variables}),
  );
  const {mutate: deleteUserMutation} = useMutation(() =>
    graphqlRequest(DeleteUser, {}),
  );

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
    console.log('error', error.message.includes(Errors.UNAUTHORIZED));
    if (error.message.includes(Errors.UNAUTHORIZED)) {
      onLogout();
      return;
    }
    console.warn(error.message);
  }, [error, isFetching, onLogout]);

  const items = useMemo(() => {
    if (feeds) {
      const results = feeds.flatMap(feed =>
        feed.feedItems.map(item => {
          if (locallyRead.includes(item.id)) {
            item.isRead = true;
          }
          return item;
        }),
      );
      const sorted = results.sort(
        (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
      );
      return sorted;
    }
  }, [feeds, locallyRead]);

  const invalidateFeeds = useCallback(
    () => queryClient.invalidateQueries(['getFeeds' + token + !fetchAll]),
    [fetchAll, queryClient, token],
  );

  const onItemClick = (item: FeedItem) => {
    if (!item.isRead) {
      markRead(
        {feeds: [{id: item.feedId, feedItemIds: [item.id]}]},
        {onSuccess: () => setLocallyRead(read => [...read, item.id])},
      );
    }
    window.open(item.url);
  };

  const markAllRead = useCallback(() => {
    if (!feeds) return;
    const request: MutationMarkReadArgs = {
      feeds: feeds.map(feed => ({
        id: feed._id,
        feedItemIds: feed.feedItems.map(item => item.id),
      })),
    };
    markRead(request, {onSuccess: invalidateFeeds});
  }, [feeds, invalidateFeeds, markRead]);

  const unreadCount = useMemo(
    () =>
      items?.reduce((acc, nextItem) => (nextItem.isRead ? acc : acc + 1), 0),
    [items],
  );

  const haveUnreads = useMemo(() => {
    return (!fetchAll && items?.length) || items?.find(item => !item.isRead);
  }, [fetchAll, items]);

  const addFeed = (url: string) => {
    addFeedByUrl({url}, {onSuccess: invalidateFeeds});
  };

  const deleteFeed = (id: string) => {
    deleteFeedById({feedId: id}, {onSuccess: invalidateFeeds});
  };

  const deleteUser = () => {
    deleteUserMutation(undefined, {
      onSuccess: () => {
        clearToken();
        onLogout();
      },
    });
  };

  return {
    addFeed,
    deleteFeed,
    deleteUser,
    errorMessage,
    fetchAll,
    hasFetched: isSuccess,
    isFetching,
    items,
    markAllRead,
    onItemClick,
    setFetchAll,
    showFetchAll: !fetchAll && feeds,
    showMarkAllRead: haveUnreads,
    unreadCount,
  };
};
