import {useEffect, useMemo, useState} from 'react';
import {FeedItem} from '../pages/api/graphql/models/types';
import {useTokenContext} from './tokenProvider';
import {Errors} from '../errors';
import {useGetFeeds, useMarkRead} from '../queries/apis';

export const useFeeds = (onLogout: () => void, feedId?: string) => {
  const {token} = useTokenContext();
  const [fetchAll, setFetchAll] = useState(!!feedId);
  const [locallyRead, setLocallyRead] = useState<string[]>([]);

  const {
    data: {feeds} = {},
    isSuccess,
    isFetching,
    error,
  } = useGetFeeds(token, fetchAll, feedId);

  const {mutate: markRead} = useMarkRead();

  useEffect(() => {
    if (feedId) setFetchAll(true);
  }, [feedId]);

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
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

  const onItemClick = (item: FeedItem) => {
    if (!item.isRead) {
      markRead(
        {feeds: [{id: item.feedId, feedItemIds: [item.id]}]},
        {onSuccess: () => setLocallyRead(read => [...read, item.id])},
      );
    }
    window.open(item.url);
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
    setFetchAll,
    showFetchAll: !fetchAll && !!feeds,
    unreadCount,
  };
};
