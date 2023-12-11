'use client';

import {useMemo} from 'react';
import {useGetFeed, useGetFeeds, useListFeeds} from '../queries/apis';

export const useFetchFeeds = (feedId?: string, fetchAll?: boolean) => {
  const {data: feedList, isLoading: listLoading, refetch} = useListFeeds();
  const feedIds = feedList?.feeds?.map(f => f._id) ?? [];

  const {
    data: {feeds: feed} = {},
    isSuccess: isFeedSuccess,
    isFetching: isFeedFetching,
    error: feedError,
  } = useGetFeed({fetchAll, feedId}, {enabled: !!feedId});
  const feedsResults = useGetFeeds(
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
        feeds: feedsResults.flatMap(result => result.data?.feeds ?? []),
        isFetching:
          listLoading || feedsResults.some(result => result.isLoading),
        error: feedsResults.find(result => result.error)?.error,
        isSuccess: feedsResults.every(result => result.isSuccess),
      };
    }
    return {
      feeds: [],
      isFetching: listLoading,
      error: undefined,
      isSuccess: false,
    };
  }, [
    feedId,
    feed,
    feedsResults,
    isFeedFetching,
    feedError,
    isFeedSuccess,
    listLoading,
  ]);

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
    return error.message;
  }, [error, isFetching]);

  const items = useMemo(() => {
    if (feeds) {
      const results = feeds.flatMap(f => f.feedItems);
      const sorted = results.sort(
        (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf(),
      );
      return sorted;
    }
  }, [feeds]);

  const unreadCountByFeed = useMemo(
    () =>
      feeds?.reduce((acc, f) => {
        f.feedItems.forEach(item => {
          if (!item.isRead) {
            acc[f._id] = (acc[f._id] ?? 0) + 1;
          }
        });

        return acc;
      }, {} as Record<string, number>) ?? {},
    [feeds],
  );

  const totalUnreadCount = useMemo(() => {
    return Object.values(unreadCountByFeed).reduce(
      (acc, next) => acc + next,
      0,
    );
  }, [unreadCountByFeed]);

  return {
    errorMessage,
    hasFetched: isSuccess,
    refetchFeeds: refetch,
    isFetching,
    feeds,
    items,
    unreadCountByFeed,
    totalUnreadCount,
  };
};
