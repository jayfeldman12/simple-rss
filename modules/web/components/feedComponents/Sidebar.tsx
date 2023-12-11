'use client';

import {useCallback, useMemo, useState} from 'react';

import {useQueryClient} from '@tanstack/react-query';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Button from 'react-bootstrap/Button';
import {Feed, MutationMarkReadArgs} from '../../app/api/graphql/models/types';
import SubmitButton from '../../components/common/SubmitButton';
import {AddFeed} from '../../components/feedComponents/AddFeed';
import {useTokenContext} from '../../context/tokenProvider';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';
import {
  getFeedKey,
  useAddFeed,
  useDeleteFeed,
  useDeleteUser,
  useMarkRead,
} from '../../queries/apis';

interface SidebarProps {
  showFetchAll: boolean;
  onPressFetchAll: () => void;
  feedId?: string;
  feeds: Feed[];
  unreadCountByFeed: Record<string, number>;
  refetchFeeds: () => void;
}

const buttonHeight = '2.5rem';

export const Sidebar = ({
  showFetchAll,
  onPressFetchAll,
  feedId,
  feeds,
  unreadCountByFeed,
  refetchFeeds,
}: SidebarProps) => {
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const queryClient = useQueryClient();
  const {windowHeight} = useWindowDimensions();

  const router = useRouter();

  const logOut = useCallback(() => router.replace('login'), [router]);
  const {clearToken} = useTokenContext();

  const onLogOut = useCallback(() => {
    clearToken();
    logOut();
  }, [clearToken, logOut]);

  const {mutate: markRead} = useMarkRead();
  const {
    mutate: addFeedByUrl,
    isLoading: addingFeed,
    error: addFeedError,
  } = useAddFeed({
    onSuccess: () => {
      refetchFeeds();
    },
  });
  const {mutate: deleteFeedById, isLoading: deletingFeed} = useDeleteFeed({
    onSuccess: () => {
      router.replace('/feeds');
      refetchFeeds();
    },
  });
  const {mutate: deleteUser, isLoading: deletingUser} = useDeleteUser();

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

  const markAllRead = useCallback(() => {
    if (!feeds) return;
    const request: MutationMarkReadArgs = {
      feeds: feeds.map(feed => ({
        id: feed._id,
        feedItemIds: feed.feedItems.map(item => item.id),
      })),
    };
    markRead(request, {
      onSuccess: () => refetchFeeds(),
    });
  }, [feeds, markRead, refetchFeeds]);

  return (
    <div
      className="d-flex flex-column bg-secondary col-2 px-4 py-5 justify-content-between"
      style={{minHeight: windowHeight}}>
      <div className="d-flex flex-column align-items-start">
        <Button
          disabled={!Object.keys(unreadCountByFeed).length}
          className="my-2"
          onClick={markAllRead}
          style={{height: buttonHeight}}>
          Mark all as read
        </Button>

        <Button
          className="my-2"
          disabled={!showFetchAll}
          onClick={onPressFetchAll}
          style={{height: buttonHeight}}>
          Get all items
        </Button>

        <AddFeed
          addFeedLoading={addingFeed}
          onSubmit={addFeed}
          error={!!addFeedError}
        />
        <Link href={'/feeds'} className="no-text-change">
          <p>All feeds</p>
        </Link>
        {feeds?.map(feed => {
          const unread = unreadCountByFeed[feed._id];
          return (
            <Link
              key={feed._id}
              href={`/feeds/${feed._id}`}
              className="no-text-change">
              <div
                className="d-flex flex-row my-1 align-self-stretch align-items-center justify-content-between"
                style={{cursor: 'pointer'}}>
                <div className="d-flex flex-row align-items-center">
                  {feed.icon ? (
                    // Using image from arbitrary remote sources, so don't want API optimization
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={feed.icon}
                      alt={`Icon for ${feed.title}`}
                      width="25"
                      height="25"
                      className="me-2"
                    />
                  ) : (
                    <div style={{height: 25, width: 25}} className="me-2" />
                  )}
                  <p
                    className="text-start mb-0"
                    style={{
                      fontWeight:
                        activeFeed?._id === feed._id ? 'bold' : 'normal',
                    }}>
                    {feed.title}
                  </p>
                </div>
                {unread ? (
                  <p className="mb-0 text-info ms-2">{unread}</p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="d-flex flex-column align-items-start">
        <SubmitButton className="my-2 mt-5" onClick={onLogOut}>
          Log out
        </SubmitButton>

        {feedId && activeFeed ? (
          <SubmitButton
            className="my-4"
            isLoading={deletingFeed}
            onClick={() => deleteFeedById({feedId})}>
            Unsubscribe from {activeFeed.title}
          </SubmitButton>
        ) : null}
        <SubmitButton
          className={`my-2 ${
            showReallyDelete
              ? 'border-warning bg-warning'
              : 'border-danger bg-danger'
          }`}
          isLoading={deletingUser}
          onClick={() => setShowReallyDelete(prevValue => !prevValue)}>
          {showReallyDelete ? 'Never mind' : 'Delete account'}
        </SubmitButton>
        {showReallyDelete ? (
          <SubmitButton
            className="my-2 bg-danger border-danger"
            isLoading={deletingUser}
            onClick={() => deleteUser()}>
            Really delete?
          </SubmitButton>
        ) : null}
      </div>
    </div>
  );
};
