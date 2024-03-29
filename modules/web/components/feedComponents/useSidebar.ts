'use client';

import {useCallback, useMemo} from 'react';

import {useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';
import {useFeedContext} from '../../context/feedProvider';
import {useTokenContext} from '../../context/tokenProvider';
import {
  getFeedKey,
  useAddFeed,
  useDeleteFeed,
  useDeleteUser,
} from '../../queries/apis';

export const useSidebar = () => {
  const queryClient = useQueryClient();

  const {
    fetchAll,
    setFetchAll,
    feedId,
    feeds,
    unreadCountByFeed,
    refetchFeeds,
    feedList,
    rawResults,
  } = useFeedContext();

  const router = useRouter();

  const logOut = useCallback(() => router.replace('login'), [router]);
  const {clearToken} = useTokenContext();

  const onLogOut = useCallback(async () => {
    await clearToken();
    logOut();
    await queryClient.resetQueries();
    queryClient.invalidateQueries();
  }, [clearToken, logOut, queryClient]);

  const {
    mutate: addFeedByUrl,
    isPending: addingFeed,
    error: addFeedError,
  } = useAddFeed({
    onSuccess: () => {
      refetchFeeds();
    },
  });
  const {mutate: deleteFeedById, isPending: deletingFeed} = useDeleteFeed({
    onSuccess: () => {
      router.replace('/feeds');
      refetchFeeds();
    },
  });
  const {mutate: deleteUser, isPending: deletingUser} = useDeleteUser();

  const addFeed = (url: string) => {
    addFeedByUrl(
      {url},
      {
        onSuccess: () =>
          queryClient.invalidateQueries({queryKey: getFeedKey()}),
      },
    );
  };

  const activeFeed = useMemo(
    () => feeds?.find(feed => feed._id.toString() === feedId),
    [feedId, feeds],
  );

  return {
    fetchAll,
    setFetchAll,
    unreadCountByFeed,
    onLogOut,
    addingFeed,
    addFeedError,
    deleteFeedById,
    deletingFeed,
    deleteUser,
    deletingUser,
    addFeed,
    activeFeed,
    feedList,
    feedId,
    rawResults,
  };
};
