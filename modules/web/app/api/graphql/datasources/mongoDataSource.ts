import {Collection, Document, ObjectId} from 'mongodb';

interface CacheEntry<T> {
  doc: T;
  expiresAt: number;
}

/**
 * Lightweight replacement for apollo-datasource-mongodb.
 * Provides findOneById with TTL caching and cache invalidation.
 */
export class MongoDataSource<TDoc extends Document> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected collection: Collection<any>;
  private cache = new Map<string, CacheEntry<TDoc>>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(collection: Collection<any>) {
    this.collection = collection;
  }

  protected async findOneById(
    id: ObjectId | string,
    options?: {ttl?: number},
  ): Promise<TDoc | null> {
    const key = id.toString();
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.doc;
    }
    this.cache.delete(key);

    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const doc = (await this.collection.findOne({_id: objectId})) as TDoc | null;
    if (doc && options?.ttl) {
      this.cache.set(key, {doc, expiresAt: Date.now() + options.ttl});
    }
    return doc;
  }

  protected deleteFromCacheById(id: ObjectId | string): void {
    this.cache.delete(id.toString());
  }
}
