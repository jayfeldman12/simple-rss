import {Collection, MongoDataSource} from 'apollo-datasource-mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {ObjectId} from 'mongodb';
import {Document} from 'mongoose';
import {USER_REFRESH_TIME} from '../../../../utils/consts';
import {
  CreateUserResponse,
  Feed,
  LoginResponse,
  MarkReadResponse,
  Maybe,
  MutationMarkReadArgs,
} from '../models/types';
import {User, WithUserId} from '../models/users';
import {FeedApi} from './feedApi';

export default class UsersApi extends MongoDataSource<User> {
  protected INVALID_CREDENTIALS = 'Invalid credentials';

  // @ts-expect-error not uninitialized, it's assigned in the super. Declaring here to override type
  protected collection: Collection<Document>;

  public async getUser(
    userId: ObjectId,
    feedApi: FeedApi,
  ): Promise<Maybe<User>> {
    const user = await this.findOneById(userId, {ttl: USER_REFRESH_TIME});
    if (!user) return null;

    const refreshedFeeds = await this.refreshFeedInfo(user, feedApi);
    return {...user, feeds: refreshedFeeds};
  }

  public refreshFeedInfo = async (user: User, feedApi: FeedApi) => {
    const results = Promise.allSettled(
      user.feeds.map(async feed => {
        const newFeed = {...feed};
        Object.assign(
          newFeed,
          await feedApi.getFeedInfoFromUrl(feed.url, feed.reads),
        );
        this.collection.updateOne(
          {_id: user._id, 'feeds._id': feed._id},
          {$set: {'feeds.$': newFeed}},
        );
        await this.deleteFromCacheById(user._id);
        return newFeed;
      }),
    );
    return (await results).map((result, index) =>
      result.status === 'fulfilled' ? result.value : user.feeds[index],
    );
  };

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
    const id = insertedId.toHexString();
    return {
      id,
      token: this.generateToken(id),
    };
  }

  public async login(
    username: string,
    password: string,
  ): Promise<LoginResponse> {
    const user = await this.collection.findOne<User>({username});
    if (!user) {
      throw new Error(this.INVALID_CREDENTIALS);
    }
    const correctPassword = await bcrypt.compareSync(password, user.password);
    if (!correctPassword) {
      throw new Error(this.INVALID_CREDENTIALS);
    }
    return {token: this.generateToken(user._id)};
  }

  public markRead = async ({
    userId,
    feeds,
  }: WithUserId<MutationMarkReadArgs>): Promise<MarkReadResponse> => {
    try {
      const count = await feeds.reduce<Promise<number>>(
        async (addCount, feed) =>
          (await addCount) +
          (await this.markFeedItemsRead(userId, feed.id, feed.feedItemIds)),
        new Promise(res => res(0)),
      );
      await this.deleteFromCacheById(userId);
      return {count};
    } catch {
      return {count: 0};
    }
  };

  public markFeedItemsRead = async (
    userId: ObjectId,
    feedId: string,
    feedItemIds: string[],
  ): Promise<number> => {
    try {
      const response = await this.collection.updateOne(
        {_id: userId, 'feeds._id': new ObjectId(feedId)},
        {$push: {'feeds.$.reads': {$each: [...feedItemIds], $slice: -1000}}},
      );
      await this.deleteFromCacheById(userId);
      return response.modifiedCount;
    } catch {
      return 0;
    }
  };

  public addFeed = async (
    url: string,
    feedApi: FeedApi,
    userId: ObjectId,
    rssUrl?: Maybe<string>,
  ) => {
    const userPromise = this.getUser(userId, feedApi);

    const feedInfo = await (rssUrl
      ? feedApi.getFeedInfoFromRssUrl(rssUrl)
      : feedApi.getFeedInfoFromUrl(url));

    const feed: Partial<Feed> = {
      url,
      _id: new ObjectId().toString(),
      ...feedInfo,
    };

    const user = await userPromise;
    if (!user) throw new Error('User not found');
    if (user.feeds.length >= 50) {
      throw new Error('Maximum of 50 feeds');
    }
    if (user?.feeds.some(oldFeed => oldFeed.url === feed.url)) {
      throw new Error('This feed already exists');
    }

    await this.collection.updateOne({_id: userId}, {$addToSet: {feeds: feed}});
    await this.deleteFromCacheById(userId);
  };

  public deleteFeed = async (userId: ObjectId, feedId: ObjectId) => {
    await this.collection.updateOne(
      {_id: userId},
      {$pull: {feeds: {_id: feedId}}},
    );
    await this.deleteFromCacheById(userId);
  };

  public deleteUser = async (userId: ObjectId) => {
    await this.collection.deleteOne({_id: userId});
    await this.deleteFromCacheById(userId);
    return {id: userId};
  };

  protected generateToken = (userId: string): string => {
    return jwt.sign({userId}, process.env.JWT_SIGNING!);
  };

  protected async updateRssLinkForUser(
    rssUrl: string,
    feedId: string,
    id: ObjectId,
  ) {
    await this.collection.updateOne(
      {_id: id, 'feeds._id': feedId},
      {$set: {'feeds.$.rssUrl': rssUrl}},
    );
    await this.deleteFromCacheById(id);
  }
}
