import type {AppProps} from 'next/app';
import Head from 'next/head';
import '../styles/custom.scss';
import '../styles/globals.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
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

const App = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default App;
