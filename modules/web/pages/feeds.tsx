import {useCallback} from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Background} from '../components/common/background';
import {PageHead} from '../components/common/pageHead';
import {Spinner} from '../components/common/Spinner';
import SubmitButton from '../components/common/SubmitButton';
import FeedCard from '../components/feedComponents/feedCard';
import {useFeeds} from '../hooks/useFeeds';
import {useRouter} from 'next/router';
import {useTokenContext} from '../hooks/tokenProvider';

const FeedsPage = () => {
  const router = useRouter();
  const logOut = useCallback(() => router.replace('login'), [router]);
  const {clearToken} = useTokenContext();

  const onLogOut = useCallback(() => {
    clearToken;
    logOut();
  }, [logOut, clearToken]);

  const {
    addFeed,
    deleteFeed,
    deleteUser,
    errorMessage,
    isFetching,
    hasFetched,
    items,
    markAllRead,
    onItemClick,
    setFetchAll,
    showFetchAll,
    showMarkAllRead,
    unreadCount,
  } = useFeeds(logOut);

  return (
    <div>
      <PageHead unreadCount={unreadCount} />
      <Background>
        {/* Sidebar */}
        <div className="d-flex flex-row">
          <div className="d-flex flex-column align-items-start col-2">
            {showFetchAll ? (
              <Button className="my-2" onClick={() => setFetchAll(true)}>
                Get all items
              </Button>
            ) : null}
            <div />
            {showMarkAllRead ? (
              <Button className="my-2" onClick={markAllRead}>
                Mark all as read
              </Button>
            ) : null}
            <div />
            <SubmitButton className="my-2" onClick={onLogOut}>
              Log out
            </SubmitButton>
            <div />

            <Form.Label className="my-2">Add Feed</Form.Label>
            <Form.Control
              onKeyDown={e =>
                e.key === 'Enter' && addFeed(e.currentTarget.value)
              }
            />

            <SubmitButton
              className="my-4"
              onClick={() => deleteFeed(items?.[0]?.feedId ?? '')}>
              Delete feed for first item
            </SubmitButton>
            <div />
            <SubmitButton className="" onClick={deleteUser}>
              Delete user
            </SubmitButton>
          </div>
          {/* Main body */}
          <div className="d-flex-inline col px-5">
            <h1>Welcome to Simple RSS</h1>
            {errorMessage ? (
              <h5 className="text-danger">{errorMessage}</h5>
            ) : null}
            {isFetching ? <Spinner /> : null}
            {hasFetched && !items?.length ? (
              <h5 className="py-5">All read!</h5>
            ) : null}
            <Row xs={1} md={2} lg={3} xl={4} className="g-4 text-dark">
              {items?.map(item => (
                <FeedCard key={item.id} item={item} onItemClick={onItemClick} />
              ))}
            </Row>
          </div>
        </div>
      </Background>
    </div>
  );
};

export default FeedsPage;
