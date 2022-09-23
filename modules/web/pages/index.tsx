import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {Background} from '../components/common/background';
import {useTokenContext} from '../hooks/tokenProvider';

const Home: NextPage = () => {
  const router = useRouter();
  const {token} = useTokenContext();

  useEffect(() => {
    if (token) {
      router.replace('feeds');
    } else {
      router.replace('login');
    }
  }, [router, token]);

  return <Background />;
};

export default Home;
