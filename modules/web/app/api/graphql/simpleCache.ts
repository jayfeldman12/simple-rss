import {FEED_REFRESH_TTL} from './consts';

type Cache<T> = Map<string, {response: T; timestampMillis: number}>;

export class SimpleCache<T> {
  protected cache: Cache<T>;

  public constructor(
    protected ttl = FEED_REFRESH_TTL,
    protected initialCache: Cache<T> = new Map(),
  ) {
    console.log('Initializing cache');
    this.cache = initialCache;
  }

  public getCacheOrFetch = async (key: string, query: () => Promise<T>) => {
    const cachedResponse = this.cache.get(key);
    if (cachedResponse) {
      const freshTimestamp = new Date(
        cachedResponse.timestampMillis + this.ttl * 1000,
      ).getTime();
      if (freshTimestamp > new Date().getTime()) {
        // Cache is still valid, use it
        return cachedResponse.response;
      } else {
        // Cache is invalid, delete it
        this.cache.delete(key);
      }
    }
    // Could not get response from cache, fetch and store
    const response = await query();
    this.cache.set(key, {response, timestampMillis: new Date().getTime()});
    return response;
  };

  public clearCacheItem = (keysToClear: string[]) => {
    keysToClear.forEach(key => this.cache.delete(key));
  };

  public clearAllCache = () => {
    this.cache = this.initialCache;
  };
}
