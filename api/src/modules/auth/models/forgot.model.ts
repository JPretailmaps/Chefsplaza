import { Types, Document } from 'mongoose';

export class ForgotModel extends Document {
  authId: Types.ObjectId;

  sourceId: Types.ObjectId;

  source: string;

  token: string;

  createdAt: Date;

  updatedAt: Date;
}
