import type {AppProps} from 'next/app';
import {fetchExchange} from 'urql';
import {withUrqlClient} from 'next-urql';
import Head from 'next/head';
import '../styles/custom.scss';
import '../styles/globals.css';

const withUrql = withUrqlClient(() => ({
  url: 'http://localhost:4000/graphql',
  exchanges: [fetchExchange],
}));

const App = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default withUrql(App);
