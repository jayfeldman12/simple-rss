import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Provider} from 'react-redux';
import {TokenProvider} from '../hooks/tokenProvider';
import '../styles/custom.scss';
import '../styles/globals.css';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import {store} from './store';

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
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <TokenProvider>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <Component {...pageProps} />
          </TokenProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default App;
