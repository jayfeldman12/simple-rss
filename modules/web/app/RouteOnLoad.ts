'use client';

import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {useTokenContext} from '../context/tokenProvider';

const RouteOnLoad = () => {
  const router = useRouter();
  const {token, hasFetched} = useTokenContext();

  useEffect(() => {
    if (hasFetched) {
      if (token) {
        router.replace('feeds');
      } else {
        router.replace('login');
      }
    }
  }, [hasFetched, router, token]);

  return null;
};

export default RouteOnLoad;
