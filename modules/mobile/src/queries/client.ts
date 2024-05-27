import {QueryClient} from '@tanstack/react-query';
import {APP_FEED_REFRESH_TIME} from './consts';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: failureCount => (failureCount + 1) * 500,
      staleTime: APP_FEED_REFRESH_TIME,
    },
  },
});
