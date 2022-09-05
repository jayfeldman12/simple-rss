import type {NextApiRequest, NextApiResponse} from 'next';
import {feeds} from './data/db';
import {JSDOM} from 'jsdom';
import RssParser from 'rss-parser';
import {Feed, FeedItem} from '../../graphql/__generated__/types';

type Data = {data: Feed[]};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const feedData = feeds;
  const data: Feed[] = (
    await Promise.allSettled<Feed>(
      feedData.map(async feed => {
        const siteSource = await (await fetch(feed.url)).text();
        const rssLink = await getRssLinkFromSite(siteSource, feed.url);
        const rssResult = await new RssParser().parseURL(rssLink);

        return {
          id: feed.id,
          title: rssResult.title,
          url: rssResult.feedUrl ?? '',
          feedItems: rssResult.items.map(item => ({
            title: item.title,
            description: item.contentSnippet,
            url: item.link ?? '',
            date: item.isoDate ?? '',
            id: item.guid ?? '',
          })),
        };
      }),
    )
  ).reduce(organizeResultsReducer, []);

  res.status(200).json({data});
}

const getRssLinkFromSite = async (
  siteText: string,
  baseUrl: string,
): Promise<string> => {
  const rssLink = new JSDOM(siteText).window.document
    .querySelector('link[type="application/rss+xml"]')
    ?.getAttribute('href');
  if (rssLink) {
    return new URL(rssLink, baseUrl).href;
  }
  // If no RSS feed found, reject promise because there will be no data
  throw Error('URL not found');
};

/** Filters rejected requests and returns values on fulfilled ones */
const organizeResultsReducer = (
  acc: Feed[],
  next: PromiseSettledResult<Feed>,
) => (next.status === 'fulfilled' ? [...acc, next.value] : acc);
