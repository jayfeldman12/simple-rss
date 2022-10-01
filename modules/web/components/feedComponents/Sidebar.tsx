import React, {useCallback, useMemo} from 'react';

import Button from 'react-bootstrap/Button';
import SubmitButton from '../../components/common/SubmitButton';
import {AddFeed} from '../../components/feedComponents/AddFeed';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useTokenContext} from '../../hooks/tokenProvider';
import {
  useMarkRead,
  useAddFeed,
  useDeleteFeed,
  useDeleteUser,
  useGetFeeds,
  getFeedKey,
} from '../../queries/apis';
import {useQueryClient} from '@tanstack/react-query';
import {MutationMarkReadArgs} from '../../pages/api/graphql/models/types';

interface SidebarProps {
  showFetchAll: boolean;
  onPressFetchAll: () => void;
}

export const Sidebar = ({showFetchAll, onPressFetchAll}: SidebarProps) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const logOut = useCallback(() => router.replace('login'), [router]);
  const {token, clearToken} = useTokenContext();
  const feedId = router.query?.feeds?.[0];

  const onLogOut = useCallback(() => {
    clearToken();
    logOut();
  }, [clearToken, logOut]);

  const {data: {feeds} = {}} = useGetFeeds(token, false);
  const {mutate: markRead} = useMarkRead();
  const {mutate: addFeedByUrl, isLoading: addingFeed} = useAddFeed();
  const {mutate: deleteFeedById, isLoading: deletingFeed} = useDeleteFeed();
  const {mutate: deleteUser, isLoading: deletingUser} = useDeleteUser();

  const addFeed = (url: string) => {
    addFeedByUrl(
      {url},
      {onSuccess: () => queryClient.invalidateQueries(getFeedKey(token))},
    );
  };

  const activeFeed = useMemo(
    () => feeds?.find(feed => feed._id.toString() === feedId),
    [feedId, feeds],
  );

  const unreadCount = useMemo(
    () =>
      feeds?.reduce((acc, feed) => {
        feed.feedItems.forEach(item => {
          if (!item.isRead) {
            acc[feed._id] = (acc[feed._id] ?? 0) + 1;
          }
        });

        return acc;
      }, {} as Record<string, string>) ?? {},
    [feeds],
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
      onSuccess: () => queryClient.invalidateQueries(getFeedKey(token)),
    });
  }, [feeds, markRead, queryClient, token]);

  return (
    <div className="d-flex flex-column bg-secondary align-items-start col-2 px-4 py-5">
      {Object.keys(unreadCount) ? (
        <Button className="my-2" onClick={markAllRead}>
          Mark all as read
        </Button>
      ) : null}
      {showFetchAll ? (
        <Button className="my-2" onClick={onPressFetchAll}>
          Get all items
        </Button>
      ) : null}
      <AddFeed addFeedLoading={addingFeed} onSubmit={addFeed} />
      <Link href={'/feeds'}>
        <p>All feeds</p>
      </Link>
      {feeds?.map(feed => {
        const unread = unreadCount[feed._id];
        return (
          <Link key={feed._id} href={`/feeds/${feed._id}`}>
            <div className="d-flex flex-row my-1 align-self-stretch align-items-center justify-content-between">
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
                ) : null}
                <p
                  className="text-start mb-0"
                  style={{
                    fontWeight:
                      activeFeed?._id === feed._id ? 'bold' : 'normal',
                  }}>
                  {feed.title}
                </p>
              </div>
              {unread ? <p className="mb-0 text-info ms-2">{unread}</p> : null}
            </div>
          </Link>
        );
      })}
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
        className="my-2"
        isLoading={deletingUser}
        onClick={() => deleteUser()}>
        Delete account
      </SubmitButton>
    </div>
  );
};
