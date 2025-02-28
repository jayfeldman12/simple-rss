'use client';

import {useState} from 'react';

import Link from 'next/link';
import {Button, Collapse} from 'react-bootstrap';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';
import {Icon} from '../common/Icon';
import SubmitButton from '../common/SubmitButton';
import {AddFeed} from './AddFeed';
import {SidebarIcon} from './SidebarIcon';
import './sidebar.css';
import {useSidebar} from './useSidebar';

interface SidebarProps {
  markAllRead: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const buttonHeight = '2.5rem';

export const Sidebar = ({
  markAllRead,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const {windowHeight, windowWidth} = useWindowDimensions();
  const smallDevice = windowWidth < 900;

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
      className={`d-flex flex-column bg-secondary col-md-2 
      ${smallDevice && sidebarOpen ? 'col-6' : 'col-2'} 
      px-2 py-5`}
      style={{minHeight: windowHeight}}>
      <div className="d-flex px-3 flex-column align-items-start">
        {smallDevice ? (
          <div
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="collapse-section"
            aria-expanded={sidebarOpen}
            style={{alignSelf: 'center'}}>
            <Icon iconName="Justify" size={40} />
          </div>
        ) : null}
        <Collapse in={smallDevice ? sidebarOpen : true} dimension="width">
          {smallDevice && !sidebarOpen ? (
            <div />
          ) : (
            <div id="collapse-section">
              <Button
                disabled={!Object.keys(unreadCountByFeed).length}
                className="sidebar-button"
                onClick={markAllRead}
                style={{minHeight: buttonHeight, marginLeft: 0}}>
                Mark all as read
              </Button>

              <Button
                className="sidebar-button"
                onClick={() => setFetchAll(!fetchAll)}
                style={{minHeight: buttonHeight}}>
                {fetchAll ? 'Show Unreads' : 'Show All'}
              </Button>

              <AddFeed
                addFeedLoading={addingFeed}
                onSubmit={addFeed}
                error={!!addFeedError}
              />
              <Link
                href={'/feeds'}
                className="no-text-change sidebar-button"
                style={{
                  minHeight: buttonHeight,
                  display: 'flex',
                  alignItems: 'center',
                }}>
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
              <div className="d-flex flex-column align-items-start">
                <SubmitButton
                  className="my-2 mt-5"
                  style={{minHeight: buttonHeight}}
                  onClick={onLogOut}>
                  Log out
                </SubmitButton>

                {feedId && activeFeed ? (
                  <SubmitButton
                    className="my-4"
                    style={{minHeight: buttonHeight}}
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
                  style={{minHeight: buttonHeight}}
                  isLoading={deletingUser}
                  onClick={() => setShowReallyDelete(prevValue => !prevValue)}>
                  {showReallyDelete ? 'Never mind' : 'Delete account'}
                </SubmitButton>
                {showReallyDelete ? (
                  <SubmitButton
                    className="my-2 bg-danger border-danger"
                    style={{minHeight: buttonHeight}}
                    isLoading={deletingUser}
                    onClick={() => deleteUser()}>
                    Really delete?
                  </SubmitButton>
                ) : null}
              </div>
            </div>
          )}
        </Collapse>
      </div>
    </div>
  );
};
