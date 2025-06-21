import { ObjectId } from 'mongoose';

export type AccessTokenPayload = {
  userId: ObjectId;
  email: string;
};
