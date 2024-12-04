'use client';

import {errors} from '@simple-rss/common';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect} from 'react';
import {useFeedContext} from '../context/feedContext';
import {getFeedKey, useMarkRead} from '../queries/api';
import {FeedItem, MutationMarkReadArgs} from '../queries/types';

export const useFeeds = (onLogout: () => void, feedId?: string) => {
  const queryClient = useQueryClient();

  const {
    errorMessage,
    hasFetched,
    isPending,
    items,
    feeds,
    totalUnreadCount,
    setFeedId,
    setFetchAll,
  } = useFeedContext();

  useEffect(() => {
    if (feedId) {
      setFeedId(feedId);
      setFetchAll(true);
    } else {
      setFeedId(undefined);
      setFetchAll(false);
    }
  }, [feedId, setFeedId, setFetchAll]);

  const {mutate: markRead} = useMarkRead();

  useEffect(() => {
    if (errorMessage?.includes(errors.UNAUTHORIZED)) {
      onLogout();
    }
  }, [errorMessage, onLogout]);

  const onItemClick = (item: FeedItem) => {
    if (!item.isRead) {
      // Optimistically update the UI
      const feedToUpdate = feeds?.find(f => f._id === item.feedId);
      if (feedToUpdate) {
        const updatedFeed = {
          ...feedToUpdate,
          reads: [...(feedToUpdate.reads ?? []), item.id],
          feedItems: feedToUpdate.feedItems.map(feedItem => ({
            ...feedItem,
            isRead: feedItem.isRead || feedItem.id === item.id,
          })),
        };
        queryClient.setQueryData(
          getFeedKey({feedId: item.feedId, fetchAll: false}),
          {
            feeds: updatedFeed,
          },
        );
      }
      markRead({feeds: [{id: item.feedId, feedItemIds: [item.id]}]});
    }
  };

  const markAllRead = useCallback(() => {
    if (!feeds) return;
    const request: MutationMarkReadArgs = {
      feeds: feeds.map(feed => ({
        id: feed._id,
        feedItemIds: feed.feedItems.map(item => item.id),
      })),
    };

    markRead(request);

    const updatedFeeds = feeds.map(f => ({
      ...f,
      feedItems: f.feedItems.map(item => ({
        ...item,
        isRead: true,
      })),
    }));
    updatedFeeds.forEach(f => {
      queryClient.setQueryData(getFeedKey({feedId: f._id, fetchAll: false}), {
        feeds: f,
      });
    });
  }, [feeds, markRead, queryClient]);

  useEffect(() => {
    document.title = `${
      totalUnreadCount ? `(${totalUnreadCount}) ` : ''
    }Simple Rss`;
  }, [totalUnreadCount]);

  return {
    errorMessage,
    hasFetched,
    isPending,
    items,
    onItemClick,
    screenTitle: feedId ? feeds?.[0]?.title ?? 'Your feeds' : 'Your feeds',
    markAllRead,
  };
};
