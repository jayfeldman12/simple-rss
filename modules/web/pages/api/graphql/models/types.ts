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
};

export type QueryFeedsArgs = {
  feedId?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<CreateUserResponse>;
  login?: Maybe<LoginResponse>;
  addFeed?: Maybe<AddFeedResponse>;
  deleteFeed?: Maybe<DeleteFeedResponse>;
  markRead?: Maybe<MarkReadResponse>;
  deleteUser?: Maybe<DeleteUser>;
};

export type MutationCreateUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type MutationAddFeedArgs = {
  url: Scalars['String'];
  rssUrl?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteFeedArgs = {
  feedId: Scalars['String'];
};

export type MutationMarkReadArgs = {
  feeds: Array<MarkReadFeed>;
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  token: Scalars['String'];
  id: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String'];
};

export type AddFeedResponse = {
  __typename?: 'AddFeedResponse';
  id: Scalars['String'];
};

export type DeleteFeedResponse = {
  __typename?: 'DeleteFeedResponse';
  id: Scalars['String'];
};

export type MarkReadResponse = {
  __typename?: 'MarkReadResponse';
  count: Scalars['Int'];
};

export type DeleteUser = {
  __typename?: 'DeleteUser';
  id: Scalars['String'];
};

export type MarkReadFeed = {
  id: Scalars['String'];
  feedItemIds: Array<Scalars['String']>;
};

/** A URL users subscribe to for RSS feeds */
export type Feed = {
  __typename?: 'Feed';
  /** A list of IDs on this feed a user has read. Used to highlight unread items */
  _id: Scalars['ID'];
  icon?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  feedItems: Array<FeedItem>;
  reads?: Maybe<Array<Scalars['ID']>>;
  /** URL of the RRS feed, can be used to get new items. If empty or erroring, this will be fetched from the main URL. */
  rssUrl: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  /** URL of the main site */
  url: Scalars['String'];
};

/** A URL users subscribe to for RSS feeds */
export type FeedFeedItemsArgs = {
  onlyUnread?: InputMaybe<Scalars['Boolean']>;
};

/** RSS feed item */
export type FeedItem = {
  __typename?: 'FeedItem';
  date: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  feedId: Scalars['String'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isRead: Scalars['Boolean'];
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};
