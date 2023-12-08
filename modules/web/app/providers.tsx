'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TokenProvider} from '../context/tokenProvider';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: failureCount => (failureCount + 1) * 500,
      staleTime: APP_FEED_REFRESH_TIME,
    },
  },
});

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TokenProvider>{children}</TokenProvider>
    </QueryClientProvider>
  );
}
