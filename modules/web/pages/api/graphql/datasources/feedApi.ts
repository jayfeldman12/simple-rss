import {RESTDataSource} from 'apollo-datasource-rest';
import {Feed, FeedItem, FeedItemImage} from '../models/types';

import {JSDOM} from 'jsdom';
import RssParser from 'rss-parser';

export class FeedApi extends RESTDataSource {
  constructor() {
    super();
  }

  public getItemsFromFeed = async (
    {rssUrl, reads}: Feed,
    onlyUnread?: boolean,
  ): Promise<(Omit<FeedItem, 'feedItemImage'> | undefined)[]> => {
    const response = await this.get(rssUrl);
    const result = await new RssParser().parseString(response);
    return result.items.map(item => {
      const id = item.guid || item.link || '';
      const isRead = reads?.includes(id) ?? false;
      if (onlyUnread && isRead) return undefined;
      return {
        title: item.title,
        description: item.contentSnippet,
        url: item.link ?? '',
        date: item.isoDate ?? '',
        id,
        isRead,
      };
    });
  };

  public getRssLinkFromUrl = async (url: string): Promise<string> => {
    const siteText = await this.get(url);

    const rssLink = new JSDOM(siteText).window.document
      .querySelector('link[type="application/rss+xml"]')
      ?.getAttribute('href');

    if (rssLink) {
      return new URL(rssLink, url).href;
    }
    // If no RSS feed found, reject promise because there will be no data
    throw Error(`RSS feed URL not found for ${url}`);
  };

  public getImageFromItem = async ({url}: FeedItem): Promise<FeedItemImage> => {
    const response = await this.get(url);
    const imgSrc =
      new JSDOM(response).window.document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content') ?? null;
    return {imgSrc};
  };
}
