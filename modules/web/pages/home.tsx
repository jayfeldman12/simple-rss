import type {NextPage} from 'next';
import {useCallback, useEffect, useState} from 'react';
import {Background} from '../components/common/background';
import {Spinner} from '../components/common/Spinner';
import {CreateAccount} from '../components/createAccount';
import FeedView from '../components/feedView';
import {LoginView} from '../components/loginView';
import {TOKEN_LOCAL_STORAGE} from './api/graphql/consts';

type Page = 'login' | 'createUser' | 'feeds';

const Home: NextPage = () => {
  const [page, setPage] = useState<Page>('login');
  const [hasLoaded, setHasLoaded] = useState(false);

  const refetchToken = useCallback(() => {
    setHasLoaded(false);
    const localToken = localStorage.getItem(TOKEN_LOCAL_STORAGE);

    if (localToken) {
      setPage('feeds');
    } else {
      setPage('login');
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    refetchToken();
  }, [refetchToken]);

  if (!hasLoaded) return <Spinner />;
  switch (page) {
    case 'login':
      return (
        <LoginView
          onCreateUserPress={() => setPage('createUser')}
          onLoginSuccess={refetchToken}
        />
      );
    case 'feeds':
      return <FeedView onLogoutSuccess={refetchToken} />;
    case 'createUser':
      return (
        <CreateAccount
          onCreateAccountSuccess={refetchToken}
          onLoginPress={() => setPage('login')}
        />
      );
    default:
      return <Background />;
  }
};

export default Home;
