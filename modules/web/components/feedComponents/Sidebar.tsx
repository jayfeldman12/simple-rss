'use client';

import {useState} from 'react';

import Link from 'next/link';
import {Button, Collapse, Container} from 'react-bootstrap';
import {useWindowDimensions} from '../../hooks/useWindowDimensions';
import {Icon} from '../common/Icon';
import SubmitButton from '../common/SubmitButton';
import {AddFeed} from './AddFeed';
import {SidebarIcon} from './SidebarIcon';
import './sidebar.css';
import {useSidebar} from './useSidebar';

interface SidebarProps {
  markAllRead: () => void;
}

const buttonHeight = '2.5rem';

export const Sidebar = ({markAllRead}: SidebarProps) => {
  const [showReallyDelete, setShowReallyDelete] = useState(false);
  const {windowHeight, windowWidth} = useWindowDimensions();
  const smallDevice = windowWidth < 900;
  const [open, setOpen] = useState(false);

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
    <Container
      className={`d-flex flex-column bg-secondary col-md-2 
      ${smallDevice && open ? 'col-6' : 'col-2'} 
      px-2 py-5`}
      style={{minHeight: windowHeight}}>
      <div className="d-flex px-3 flex-column align-items-start">
        {smallDevice ? (
          <div
            onClick={() => setOpen(!open)}
            aria-controls="collapse-section"
            aria-expanded={open}
            style={{alignSelf: 'center'}}>
            <Icon iconName="Justify" size={40} />
          </div>
        ) : null}
        <Collapse in={smallDevice ? open : true} dimension="width">
          <div id="collapse-section">
            <Button
              disabled={!Object.keys(unreadCountByFeed).length}
              className="sidebar-button"
              onClick={markAllRead}
              style={{height: buttonHeight, marginLeft: 0}}>
              Mark all as read
            </Button>

            <Button
              className="sidebar-button"
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
            <Link href={'/feeds'} className="no-text-change sidebar-button">
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
        </Collapse>
      </div>
    </Container>
  );
};
