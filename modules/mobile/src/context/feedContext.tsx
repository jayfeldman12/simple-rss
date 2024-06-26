'use client';

import {UseQueryResult} from '@tanstack/react-query';
import React, {useContext, useMemo, useState} from 'react';
import {
  FeedListResponse,
  FeedResponse,
  useGetFeed,
  useGetFeeds,
  useListFeeds,
} from '../queries/api';
import {Feed, FeedItem} from '../queries/types';
import {useTokenStore} from '../store/tokenStore';

interface FeedProvider {
  errorMessage: string;
  hasFetched: boolean;
  refetchFeeds: () => void;
  isPending: boolean;
  feeds: Feed[];
  items: FeedItem[] | undefined;
  unreadCountByFeed: Record<string, number>;
  totalUnreadCount: number;
  feedList: FeedListResponse['feeds'] | undefined;
  rawResults: UseQueryResult<FeedResponse, Error>[];
  fetchAll: boolean;
  feedId: string | undefined;
  setFeedId: (feedId: string | undefined) => void;
  setFetchAll: (fetchAll: boolean) => void;
}

export const FeedContext = React.createContext<FeedProvider>({
  errorMessage: '',
  hasFetched: false,
  refetchFeeds: () => {},
  isPending: false,
  feeds: [],
  items: [],
  unreadCountByFeed: {},
  totalUnreadCount: 0,
  feedList: [],
  rawResults: [],
  setFeedId: () => {},
  setFetchAll: () => {},
  fetchAll: false,
  feedId: undefined,
});

export const useFeedContext = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeedContext must be used within a FeedProvider');
  }
  return context;
};

export const FeedProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const {token} = useTokenStore(state => state.tokenInfo);
  const [feedId, setFeedId] = useState<string | undefined>(undefined);
  const [fetchAll, setFetchAll] = useState(false);

  const {
    data: feedListResponse,
    isLoading: listLoading,
    refetch,
  } = useListFeeds({enabled: !!token});
  const feedList = feedListResponse?.feeds;
  const feedIds = feedList?.map(f => f._id) ?? [];

  const {
    data: {feeds: feed} = {},
    isSuccess: isFeedSuccess,
    isPending: isFeedFetching,
    error: feedError,
  } = useGetFeed({fetchAll, feedId}, {enabled: !!feedId});
  const feedsResults = useGetFeeds(
    {fetchAll, feedIds},
    {enabled: !feedId && !!feedIds?.length},
  );

  const flatFeeds = useMemo(
    () => feedsResults.flatMap(result => result.data?.feeds ?? []),
    [feedsResults],
  );

  const {feeds, isPending, error, isSuccess} = useMemo(() => {
    if (feedId && feed?.length) {
      return {
        feeds: feed,
        isPending: isFeedFetching,
        error: feedError,
        isSuccess: isFeedSuccess,
      };
    }
    if (flatFeeds.length) {
      return {
        feeds: flatFeeds,
        isPending:
          listLoading ||
          feedsResults.some(result => result.isPending || result.isRefetching),
        error: feedsResults.find(result => result.error)?.error,
        isSuccess: feedsResults.every(result => result.isSuccess),
      };
    }
    return {
      feeds: [],
      isPending: listLoading,
      error: undefined,
      isSuccess: false,
    };
  }, [
    feedId,
    feed,
    flatFeeds,
    listLoading,
    isFeedFetching,
    feedError,
    isFeedSuccess,
    feedsResults,
  ]);

  const errorMessage = useMemo(() => {
    if (!error || isPending) {
      return '';
    }
    return error.message;
  }, [error, isPending]);

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
      (flatFeeds.length ? flatFeeds : feeds)?.reduce(
        (acc, f) => {
          f.feedItems.forEach(item => {
            if (!item.isRead) {
              acc[f._id] = (acc[f._id] ?? 0) + 1;
            }
          });

          return acc;
        },
        {} as Record<string, number>,
      ) ?? {},
    [feeds, flatFeeds],
  );

  const totalUnreadCount = useMemo(() => {
    return Object.values(unreadCountByFeed).reduce(
      (acc, next) => acc + next,
      0,
    );
  }, [unreadCountByFeed]);

  return (
    <FeedContext.Provider
      value={{
        errorMessage,
        hasFetched: isSuccess,
        refetchFeeds: refetch,
        isPending,
        feeds,
        items,
        unreadCountByFeed,
        totalUnreadCount,
        feedList,
        rawResults: feedsResults,
        fetchAll,
        feedId,
        setFeedId,
        setFetchAll,
      }}>
      {children}
    </FeedContext.Provider>
  );
};
