import {RESTDataSource} from 'apollo-datasource-rest';
import {Feed, FeedItem} from '../models/types';

import {JSDOM} from 'jsdom';
import RssParser from 'rss-parser';

export class FeedApi extends RESTDataSource {
  constructor() {
    super();
  }

  public getFeedInfo = async (
    feed: Feed,
    updateFeedWithRss: (rssLink: string, feedId: string) => unknown,
  ): Promise<Feed> => {
    if (feed.rssUrl) {
      return feed;
    }
    const response = await this.get(feed?.url);
    const rssUrl = await this.getRssLinkFromSite(response, feed.url);
    updateFeedWithRss(rssUrl, feed._id);
    return {
      ...feed,
      rssUrl,
    };
  };

  public getFeedItems = async (rssUrl: string): Promise<FeedItem[]> => {
    const response = await this.get(rssUrl);
    const result = await new RssParser().parseString(response);
    return result.items.map(item => ({
      title: item.title,
      description: item.contentSnippet,
      url: item.link ?? '',
      date: item.isoDate ?? '',
      id: item.guid ?? item.link ?? '',
    }));
  };

  protected getRssLinkFromSite = async (
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
    throw Error(`RSS feed URL not found for ${baseUrl}`);
  };
}
