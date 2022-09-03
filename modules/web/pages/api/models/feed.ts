export interface FeedItem {
  date?: string;
  description?: string | null;
  title?: string;
  url?: string;
}

export interface Feed {
  feedItems: FeedItem[];
  title?: string;
  url?: string;
}
