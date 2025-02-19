import { Document, Types } from 'mongoose';

export class PerformerBlockCountryModel extends Document {
  source: string;

  sourceId: Types.ObjectId | string;

  countryCodes: string[];

  createdAt: Date;

  updatedAt: Date;
}
