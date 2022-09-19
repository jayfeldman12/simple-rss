import Head from 'next/head';

export interface HeadProps {
  unreadCount?: number;
}

export const PageHead = ({unreadCount}: HeadProps) => {
  return (
    <Head>
      <title>{`${unreadCount ? `(${unreadCount}) ` : ''}Simple Rss`}</title>
      <meta name="description" content="Simple RSS feed" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
