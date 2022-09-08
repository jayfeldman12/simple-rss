import {Collection, MongoDataSource} from 'apollo-datasource-mongodb';
import {DEFAULT_TTL_SECONDS} from '../consts';
import {Users} from '../models/users';
import {Document} from 'mongoose';
import {ObjectId} from 'mongodb';

export default class UsersApi extends MongoDataSource<Users> {
  // @ts-expect-error it's assigned in the super
  protected collection: Collection<Document>;

  public async getFeedFromUser(username: string) {
    if (!username) {
      throw new Error('Username missing');
    }
    const users = await this.findByFields(
      {username},
      {ttl: DEFAULT_TTL_SECONDS},
    );
    if (users.length > 1) {
      throw new Error('Multiple users found, uniqueness constraint violated');
    } else if (users.length === 0) {
      throw new Error('No user found');
    }
    return users[0];
  }

  public markRead = async (
    username: string,
    feedId: string,
    feedItemId: string,
  ): Promise<{success: boolean}> => {
    try {
      console.log('marking', username, feedId, feedItemId);
      console.log('matcher', {username, 'feeds._id': feedId});
      const response = await this.collection.updateOne(
        {username, 'feeds._id': new ObjectId(feedId)},
        {$addToSet: {'feeds.$.reads': feedItemId}},
      );
      console.log('response mark true', response);
      return {success: response.modifiedCount > 0};
    } catch {
      return {success: false};
    }
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

    this.collection.updateOne(
      {username, 'feeds._id': feedId},
      {$set: {'feeds.$.rssUrl': rssUrl}},
    );
  }
}
