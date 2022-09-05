import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {createClient, fetchExchange, Provider} from 'urql';
import {withUrqlClient} from 'next-urql';

// const client = createClient({
//   url: 'http://localhost:4000/graphql',
// });

const withUrql = withUrqlClient(() => ({
  url: 'http://localhost:4000/graphql',
  exchanges: [fetchExchange],
}));

const App = ({Component, pageProps}: AppProps) => {
  return <Component {...pageProps} />;
};

export default withUrql(App);
