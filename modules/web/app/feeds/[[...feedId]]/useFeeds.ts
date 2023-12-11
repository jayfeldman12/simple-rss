'use client';

import {useQueryClient} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {Errors} from '../../../errors';
import {useFetchFeeds} from '../../../hooks/useFetchFeeds';
import {getFeedKey, useMarkRead} from '../../../queries/apis';
import {FeedItem} from '../../api/graphql/models/types';

export const useFeeds = (onLogout: () => void, feedId?: string) => {
  const [fetchAll, setFetchAll] = useState(!!feedId);
  const queryClient = useQueryClient();

  const {
    errorMessage,
    hasFetched,
    isFetching,
    items,
    feeds,
    totalUnreadCount,
    unreadCountByFeed,
    refetchFeeds,
  } = useFetchFeeds(feedId, fetchAll);

  const {mutate: markRead} = useMarkRead();

  useEffect(() => {
    if (feedId) setFetchAll(true);
    else setFetchAll(false);
  }, [feedId]);

  useEffect(() => {
    if (errorMessage?.includes(Errors.UNAUTHORIZED)) {
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

  return {
    errorMessage,
    hasFetched,
    isFetching,
    items,
    feeds,
    onItemClick,
    screenTitle: feedId ? feeds?.[0]?.title ?? 'Your feeds' : 'Your feeds',
    setFetchAll,
    showFetchAll: !fetchAll && !!feeds,
    totalUnreadCount,
    unreadCountByFeed,
    refetchFeeds,
  };
};
