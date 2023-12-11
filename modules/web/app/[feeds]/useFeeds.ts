'use client';

import {useQueryClient} from '@tanstack/react-query';
import {useEffect, useMemo, useState} from 'react';
import {useTokenContext} from '../../context/tokenProvider';
import {Errors} from '../../errors';
import {
  getFeedKey,
  useGetFeed,
  useGetFeeds,
  useListFeeds,
  useMarkRead,
} from '../../queries/apis';
import {FeedItem} from '../api/graphql/models/types';

export const useFeeds = (onLogout: () => void, feedId?: string) => {
  const {token} = useTokenContext();
  const [fetchAll, setFetchAll] = useState(!!feedId);
  const [locallyRead, setLocallyRead] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const {data: feedList} = useListFeeds(token, {enabled: fetchAll});
  console.log('list before', feedList);
  const feedIds = feedList?.feeds?.map(f => f._id) ?? [];
  console.log('list after', feedIds);

  const {
    data: {feeds: feed} = {},
    isSuccess: isFeedSuccess,
    isFetching: isFeedFetching,
    error: feedError,
  } = useGetFeed(token, {fetchAll, feedId}, {enabled: !!feedId});
  const feedsResults = useGetFeeds(
    token,
    {fetchAll, feedIds},
    {enabled: !feedId && !!feedIds?.length},
  );

  const {feeds, isFetching, error, isSuccess} = useMemo(() => {
    if (feedId && feed?.length) {
      return {
        feeds: feed,
        isFetching: isFeedFetching,
        error: feedError,
        isSuccess: isFeedSuccess,
      };
    }
    if (feedsResults?.length) {
      return {
        feeds: feedsResults.flatMap(result => result.data ?? []),
        isFetching: feedsResults.some(result => result.isLoading),
        error: feedsResults.find(result => result.error)?.error,
        isSuccess: feedsResults.every(result => result.isSuccess),
      };
    }
    return {feeds: [], isFetching: false, error: undefined, isSuccess: false};
  }, [feedId, feedsResults, feed, isFeedFetching, feedError, isFeedSuccess]);

  const {mutate: markRead} = useMarkRead();

  useEffect(() => {
    if (feedId) setFetchAll(true);
    else setFetchAll(false);
  }, [feedId]);

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
    if (error.message?.includes(Errors.UNAUTHORIZED)) {
      onLogout();
      return;
    }
    console.warn(error.message);
  }, [error, isFetching, onLogout]);

  const items = useMemo(() => {
    if (feeds) {
      const results = feeds.flatMap(f =>
        f.feedItems.map(item => {
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

  const onItemClick = (item: FeedItem) => {
    if (!item.isRead) {
      markRead(
        {feeds: [{id: item.feedId, feedItemIds: [item.id]}]},
        {
          onSuccess: () => {
            setLocallyRead(read => [...read, item.id]);
            // Clear the sidebar query
            queryClient.invalidateQueries({
              queryKey: getFeedKey(token, {isSidebar: true}),
            });
          },
        },
      );
    }
  };

  const unreadCount = useMemo(
    () =>
      items?.reduce((acc, nextItem) => (nextItem.isRead ? acc : acc + 1), 0),
    [items],
  );

  return {
    errorMessage,
    hasFetched: isSuccess,
    isFetching,
    items,
    onItemClick,
    screenTitle: feedId ? feeds?.[0]?.title ?? 'Your feeds' : 'Your feeds',
    setFetchAll,
    showFetchAll: !fetchAll && !!feeds,
    unreadCount,
  };
};
