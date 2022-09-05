export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  /** Get all fields user has subscribed to */
  feeds?: Maybe<Array<Maybe<Feed>>>;
  /** If passed in a feed ID, return all RSS items for that feed. Otherwise, return all feeds items */
  feedItems?: Maybe<Array<Maybe<FeedItem>>>;
};

/** A URL users subscribe to for RSS feeds */
export type Feed = {
  __typename?: 'Feed';
  description?: Maybe<Scalars['String']>;
  feedItems?: Maybe<Array<Maybe<FeedItem>>>;
  id: Scalars['ID'];
  /** A list of IDs on this feed a user has read. Used to highlight unread items */
  reads?: Maybe<Array<Maybe<Scalars['ID']>>>;
  /** URL of the RRS feed, can be used to get new items. If empty or erroring, this will be fetched from the main URL. */
  rssUrl?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  /** URL of the main site */
  url: Scalars['String'];
};

/** RSS feed item */
export type FeedItem = {
  __typename?: 'FeedItem';
  date: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};
