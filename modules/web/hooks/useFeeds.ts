import {useCallback, useMemo, useState} from 'react';
import {
  Feed,
  FeedItem,
  MutationMarkReadArgs,
} from '../pages/api/graphql/models/types';
import {FeedQuery, MarkRead} from '../queries/feedQueries';
import {graphqlRequest} from '../graphqlRequest';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {TOKEN_LOCAL_STORAGE} from '../pages/api/graphql/consts';

type FeedResponse = {
  feeds: Feed[];
};

export const useFeeds = () => {
  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE);
  const queryClient = useQueryClient();
  const [fetchAll, setFetchAll] = useState(false);

  const {
    data: {feeds} = {},
    isSuccess,
    isFetching,
    error,
  } = useQuery<FeedResponse, Error>(
    ['getFeeds' + token + !fetchAll],
    () => graphqlRequest(FeedQuery, {onlyUnread: !fetchAll}),
    {
      refetchInterval: APP_FEED_REFRESH_TIME + 10, // make sure it's not marked as stale
      refetchIntervalInBackground: true,
    },
  );
  const {mutate: markRead} = useMutation((variables: MutationMarkReadArgs) =>
    graphqlRequest(MarkRead, {...variables}),
  );

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
  }, [error, isFetching]);

  const items = useMemo(() => {
    if (feeds) {
      const results = feeds.flatMap(feed => feed.feedItems);
      const sorted = results.sort(
        (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
      );
      return sorted;
    }
  }, [feeds]);

  const invalidateFeeds = useCallback(
    () => queryClient.invalidateQueries(['getFeeds' + token + !fetchAll]),
    [fetchAll, queryClient, token],
  );

  const onItemClick = (item: FeedItem) => {
    if (!item.isRead) {
      markRead(
        {feeds: [{id: item.feedId, feedItemIds: [item.id]}]},
        {onSuccess: invalidateFeeds},
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

  return {
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
