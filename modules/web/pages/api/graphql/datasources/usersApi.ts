import {Collection, MongoDataSource} from 'apollo-datasource-mongodb';
import {FEED_REFRESH_TTL} from '../consts';
import {Users} from '../models/users';
import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import {
  Feed,
  MarkReadFeed,
  MarkReadResponse,
  MutationMarkReadArgs,
} from '../models/types';
import {FeedApi} from './feedApi';

export default class UsersApi extends MongoDataSource<Users> {
  // @ts-expect-error not uninitialized, it's assigned in the super
  protected collection: Collection<Document>;

  public async getUser(username: string) {
    if (!username) {
      throw new Error('Username missing');
    }
    const users = await this.findByFields({username}, {ttl: FEED_REFRESH_TTL});
    if (users.length > 1) {
      throw new Error('Multiple users found, uniqueness constraint violated');
    } else if (users.length === 0) {
      throw new Error('No user found');
    }
    return users[0];
  }

  public markRead = async ({
    username,
    feeds,
  }: MutationMarkReadArgs): Promise<MarkReadResponse> => {
    try {
      const count = await feeds.reduce<Promise<number>>(
        async (addCount, feed) =>
          (await addCount) +
          (await this.markFeedItemsRead(username, feed.id, feed.feedItemIds)),
        new Promise(res => res(0)),
      );
      await this.deleteFromCacheByFields({username});
      return {count};
    } catch {
      return {count: 0};
    }
  };

  public markFeedItemsRead = async (
    username: string,
    feedId: string,
    feedItemIds: string[],
  ): Promise<number> => {
    try {
      const response = await this.collection.updateOne(
        {username, 'feeds._id': new ObjectId(feedId)},
        {$addToSet: {'feeds.$.reads': {$each: [...feedItemIds]}}},
      );
      return response.modifiedCount;
    } catch {
      return 0;
    }
  };

  public addFeed = async (feed: Feed, feedApi: FeedApi, username: string) => {
    if (!feed.rssUrl) {
      feed.rssUrl = await feedApi.getRssLinkFromUrl(feed?.url);
    }
    await this.collection.updateOne({username}, {$addToSet: {feeds: feed}});
    await this.deleteFromCacheByFields({username});
  };

  public async updateRssLinkForUser(
    rssUrl: string,
    feedId: string,
    username: string,
  ) {
    if (!rssUrl || !username) {
      console.warn('Cannot update Rsslink due to missing link or username');
      return;
    }

    await this.collection.updateOne(
      {username, 'feeds._id': feedId},
      {$set: {'feeds.$.rssUrl': rssUrl}},
    );
    await this.deleteFromCacheByFields({username});
  }
}
