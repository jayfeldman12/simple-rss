import {Collection, MongoDataSource} from 'apollo-datasource-mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';
import {FEED_REFRESH_TTL} from '../consts';
import {User} from '../models/users';
import {
  CreateUserResponse,
  Feed,
  LoginResponse,
  MarkReadResponse,
  MutationMarkReadArgs,
} from '../models/types';
import {FeedApi} from './feedApi';

export default class UsersApi extends MongoDataSource<User> {
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

  public async createUser(
    username: string,
    password: string,
  ): Promise<CreateUserResponse> {
    if (!username || !password) {
      throw new Error('Username and password required');
    }
    if (password.length < 8 || !password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
      throw new Error('Password must be 8 chars and have letters and numbers');
    }
    const alreadyExists = await this.collection.findOne({username});
    if (alreadyExists) {
      throw new Error('Username taken');
    }
    const hash = await bcrypt.hashSync(password);
    const {insertedId} = await this.collection.insertOne({
      username,
      password: hash,
      feeds: [],
    });
    return {
      id: insertedId.toHexString(),
      token: (await this.login(username, password)).token,
    };
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    const INVALID_CREDENTIALS = 'Invalid credentials';
    const user = await this.collection.findOne<User>({username});
    if (!user) {
      throw new Error(INVALID_CREDENTIALS);
    }
    const correctPassword = await bcrypt.compareSync(password, user.password);
    if (!correctPassword) {
      throw new Error(INVALID_CREDENTIALS);
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SIGNING!);
    return {token};
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
