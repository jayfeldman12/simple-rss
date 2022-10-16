import {RESTDataSource} from 'apollo-datasource-rest';
import {Feed, FeedItem} from '../models/types';

import {JSDOM} from 'jsdom';
import RssParser from 'rss-parser';
import {FEED_REFRESH_TTL} from '../consts';
import {Logger} from '../logger';

const ONE_DAY = 60 * 60 * 24;

export class FeedApi extends RESTDataSource {
  constructor() {
    super();
  }

  public getItemsFromFeed = async (
    {rssUrl, reads, _id: feedId}: Feed,
    onlyUnread?: boolean,
  ): Promise<(FeedItem | undefined)[]> => {
    const response = await this.withTimeout(
      this.get(rssUrl, undefined, {cacheOptions: {ttl: FEED_REFRESH_TTL}}),
    );
    Logger.info('got item', rssUrl);
    const result = await new RssParser().parseString(response);
    return result.items.map(item => {
      const image = (() => {
        if (item.enclosure?.url) return item.enclosure.url;

        const content = new JSDOM(item.content).window.document;

        const img = content.querySelector('img')?.getAttribute('src');
        if (img) return img;

        const contentEncoded = new JSDOM(item['content:encoded']).window
          .document;

        const aHref = Array.from(contentEncoded.querySelectorAll('a'))
          .find(aTag => aTag.getAttribute('href')?.match(/png|jgp|svg|gif/))
          ?.getAttribute('href');
        return aHref ?? '';
      })();

      const id = item.guid || item.link || '';
      const isRead = reads?.includes(id) ?? false;
      Logger.info('format response', rssUrl);
      if (onlyUnread && isRead) return undefined;
      return {
        date: item.isoDate ?? '',
        description: item.contentSnippet,
        feedId: feedId,
        id,
        image: image ?? '',
        isRead,
        title: item.title,
        url: item.link ?? '',
      };
    });
  };

  public getFeedInfoFromUrl = async (url: string): Promise<Partial<Feed>> => {
    const fixedUrl = url.includes('http') ? url : 'https://' + url;
    const origin = new URL(fixedUrl).origin;
    const siteText = await this.withTimeout(
      this.get(origin, undefined, {cacheOptions: {ttl: ONE_DAY}}),
    );
    const document = new JSDOM(siteText).window.document;
    const rssUrl =
      document
        .querySelector('link[type="application/rss+xml"]')
        ?.getAttribute('href') ??
      document
        .querySelector('link[type="application/atom+xml"]')
        ?.getAttribute('href');
    const icon =
      document
        .querySelector('link[type="image/x-icon"]')
        ?.getAttribute('href') ??
      document.querySelector('link[rel="SHORTCUT ICON"]')?.getAttribute('href');

    if (rssUrl) {
      const rssFixedUrl = new URL(rssUrl, fixedUrl).href;
      const title = (await this.getFeedInfoFromRssUrl(rssFixedUrl)).title ?? '';
      return {
        url: origin,
        rssUrl: rssFixedUrl,
        icon: icon ? new URL(icon, fixedUrl).href : undefined,
        reads: [],
        title,
      };
    }
    // If no RSS feed found, reject promise because there will be no data
    throw Error(`RSS feed URL not found for ${url}`);
  };

  public getFeedInfoFromRssUrl = async (
    rssUrl: string,
  ): Promise<Partial<Feed>> => {
    const response = await this.withTimeout(
      this.get(rssUrl, undefined, {cacheOptions: {ttl: FEED_REFRESH_TTL}}),
    );
    const result = await new RssParser().parseString(response);
    return {
      rssUrl,
      title: result.title,
      reads: [],
    };
  };

  // Adds a timeout, in ms, that the request will reject if it's not completed in that time
  protected withTimeout = <T extends unknown>(
    request: Promise<T>,
    timeout = 5000,
  ): Promise<T> => {
    let timeoutRef: NodeJS.Timeout;
    return Promise.race([
      request,
      new Promise<T>(
        (_, reject) =>
          (timeoutRef = setTimeout(
            () => reject(new Error('Request timeout')),
            timeout,
          )),
      ),
    ]).finally(() => clearTimeout(timeoutRef));
  };
}
