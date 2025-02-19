import { Document, Types } from 'mongoose';

export class BankingModel extends Document {
  firstName?: string;

  lastName?: string;

  SSN?: string;

  bankName?: string;

  bankAccount?: string;

  bankRouting?: string;

  bankSwiftCode?: string;

  address?: string;

  city?: string;

  state?: string;

  country?: string;

  performerId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
