'use client';

import {Params} from 'next/dist/shared/lib/router/utils/route-matcher';
import {useParams, useRouter} from 'next/navigation';
import {useCallback} from 'react';
import Row from 'react-bootstrap/Row';
import {Spinner} from '../../../components/common/Spinner';
import {Background} from '../../../components/common/background';
import {PageHead} from '../../../components/common/pageHead';
import {Sidebar} from '../../../components/feedComponents/Sidebar';
import FeedCard from '../../../components/feedComponents/feedCard';
import {useFeeds} from './useFeeds';

interface FeedsPageParams extends Params {
  feedId?: string[];
}

const FeedsPage = () => {
  const router = useRouter();
  const params = useParams<FeedsPageParams>();
  const feedId = params?.feedId?.[0];
  const logOut = useCallback(() => router.push('/login'), [router]);

  const {
    errorMessage,
    hasFetched,
    isFetching,
    items,
    onItemClick,
    screenTitle,
    totalUnreadCount,
    markAllRead,
  } = useFeeds(logOut, feedId);

  return (
    <div>
      <PageHead unreadCount={totalUnreadCount} />
      <Background>
        <div className="row g-0">
          <Sidebar markAllRead={markAllRead} />
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
