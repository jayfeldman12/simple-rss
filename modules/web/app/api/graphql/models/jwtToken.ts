import {ObjectId} from 'mongodb';

export type JWTToken = {userId: ObjectId} | undefined;
