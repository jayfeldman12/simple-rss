import {Feed} from './types';

export interface User {
  _id: string;
  username: string;
  password: string;
  feeds: Feed[];
}
