import {useCallback} from 'react';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import {PageHead} from './common/pageHead';
import {useFeeds} from '../hooks/useFeeds';
import FeedCard from './feedComponents/feedCard';
import {Background} from './common/background';
import {Spinner} from './common/Spinner';
import SubmitButton from './common/SubmitButton';
import {TOKEN_LOCAL_STORAGE} from '../pages/api/graphql/consts';

export interface FeedViewProps {
  onLogoutSuccess: () => void;
}

const FeedView = ({onLogoutSuccess}: FeedViewProps) => {
  const {
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
  } = useFeeds();

  const onLogOut = useCallback(() => {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE);
    onLogoutSuccess();
  }, [onLogoutSuccess]);

  return (
    <div>
      <PageHead unreadCount={unreadCount} />

      <Background>
        <h1>Welcome to Simple RSS</h1>
        {errorMessage ? <h5 className="text-danger">{errorMessage}</h5> : null}
        {isFetching ? <Spinner /> : null}
        {hasFetched && !items?.length ? (
          <h5 className="py-5">All read!</h5>
        ) : null}

        <Row xs={1} md={2} lg={3} xl={4} className="g-4 text-dark">
          {items?.map(item => (
            <FeedCard key={item.id} item={item} onItemClick={onItemClick} />
          ))}
        </Row>
        {showFetchAll ? (
          <Button className="col-sm-2 my-3" onClick={() => setFetchAll(true)}>
            Get all items
          </Button>
        ) : null}
        <div />
        {showMarkAllRead ? (
          <Button className="col-sm-2 my-3" onClick={markAllRead}>
            Mark all as read
          </Button>
        ) : null}
        <SubmitButton onClick={onLogOut}>Log out</SubmitButton>
      </Background>
    </div>
  );
};

export default FeedView;
