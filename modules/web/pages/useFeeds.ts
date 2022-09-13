import {useCallback, useMemo, useState} from 'react';
import {
  Feed,
  FeedItem,
  Maybe,
  MutationMarkReadArgs,
} from './api/graphql/models/types';
import {FeedQuery, MarkRead} from '../queries/feedQuery';
import {graphqlRequest} from '../graphqlRequest';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

type FeedResponse = {
  feeds: Feed[];
};

const NO_USER_FOUND = 'No user found';

export const useFeeds = () => {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');
  const [pauseQueries, setPauseQueries] = useState(true);
  const [fetchAll, setFetchAll] = useState(false);

  const {
    data: {feeds} = {},
    isFetching,
    error,
  } = useQuery<FeedResponse, Error>(
    ['getFeeds' + username],
    () => graphqlRequest(FeedQuery, {username, onlyUnread: !fetchAll}),
    {enabled: !pauseQueries},
  );
  const {mutate: markRead} = useMutation((variables: MutationMarkReadArgs) =>
    graphqlRequest(MarkRead, {...variables}),
  );

  const errorMessage = useMemo(() => {
    if (!error || isFetching) {
      return '';
    }
    setPauseQueries(true);
    if (error.message.includes(NO_USER_FOUND)) {
      return 'Invalid username';
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
    () => queryClient.invalidateQueries(['getFeeds' + username]),
    [queryClient, username],
  );

  const onItemClick = (feedId: string, item: FeedItem) => {
    if (!item.isRead) {
      markRead(
        {username, feeds: [{id: feedId, feedItemIds: [item.id]}]},
        {onSuccess: invalidateFeeds},
      );
    }
    window.open(item.url);
  };

  const markAllRead = useCallback(() => {
    if (!feeds) return;
    const request: MutationMarkReadArgs = {
      username,
      feeds: feeds.map(feed => ({
        id: feed._id,
        feedItemIds: feed.feedItems.map(item => item.id),
      })),
    };
    markRead(request, {onSuccess: invalidateFeeds});
  }, [feeds, invalidateFeeds, markRead, username]);

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
    isFetching,
    items,
    markAllRead,
    onItemClick,
    setFetchAll,
    setPauseQueries,
    setUsername,
    showFetchAll: !fetchAll && feeds,
    showMarkAllRead: haveUnreads,
    unreadCount,
  };
};
