'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {useCallback} from 'react';
import Row from 'react-bootstrap/Row';
import {Spinner} from '../../components/common/Spinner';
import {Background} from '../../components/common/background';
import {PageHead} from '../../components/common/pageHead';
import {Sidebar} from '../../components/feedComponents/Sidebar';
import FeedCard from '../../components/feedComponents/feedCard';
import {useFeeds} from './useFeeds';

const FeedsPage = () => {
  const router = useRouter();
  const logOut = useCallback(() => router.push('/login'), [router]);
  const searchParams = useSearchParams();
  const feedId = searchParams?.get('feeds')?.[0];

  const {
    errorMessage,
    hasFetched,
    isFetching,
    items,
    onItemClick,
    screenTitle,
    setFetchAll,
    showFetchAll,
    unreadCount,
  } = useFeeds(logOut, feedId);

  return (
    <div>
      <PageHead unreadCount={unreadCount} />
      <Background>
        <div className="row g-0">
          <Sidebar
            showFetchAll={showFetchAll}
            onPressFetchAll={() => setFetchAll(true)}
          />
          {/* Main body */}
          <div className="col px-5 py-4">
            <h1 className="pb-5">{screenTitle}</h1>
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
