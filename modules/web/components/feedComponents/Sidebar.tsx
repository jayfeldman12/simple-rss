'use client';

import {useState} from 'react';

import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import SubmitButton from '../../components/common/SubmitButton';
import {AddFeed} from '../../components/feedComponents/AddFeed';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';
import {SidebarIcon} from './SidebarIcon';
import {useSidebar} from './useSidebar';

interface SidebarProps {
  markAllRead: () => void;
}

const buttonHeight = '2.5rem';

export const Sidebar = ({markAllRead}: SidebarProps) => {
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const {windowHeight} = useWindowDimensions();

  const {
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
    feedId,
    feedList,
    rawResults,
  } = useSidebar();

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
          disabled={!fetchAll}
          onClick={() => setFetchAll(true)}
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
        {feedList?.map((feed, index) => {
          const unreadCount = unreadCountByFeed[feed._id];
          return (
            <Link
              key={feed._id}
              href={`/feeds/${feed._id}`}
              className="no-text-change">
              <SidebarIcon
                {...feed}
                isActive={feed._id === activeFeed?._id}
                unreadCount={unreadCount}
                isLoading={rawResults[index]?.isLoading ?? false}
              />
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
