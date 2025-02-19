import { Types, Document } from 'mongoose';

export class OAuthLoginModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  provider: string;

  value: string;

  createdAt: Date;

  updatedAt: Date;
}
