import {QueryClient} from '@tanstack/react-query';
import {Metadata} from 'next';
import {APP_FEED_REFRESH_TIME} from '../utils/consts';
import Providers from './providers';
import './styles/custom.scss';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: failureCount => (failureCount + 1) * 500,
      staleTime: APP_FEED_REFRESH_TIME,
    },
  },
});

export const metadata: Metadata = {
  title: 'Simple Rss',
  description: 'RSS feed',
  applicationName: 'Simple RSS',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      style={{overscrollBehaviorY: 'none', backgroundColor: '#0f083c'}}>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
