import { Document, Types } from 'mongoose';

export class ShippingAddressModel extends Document {
  source: string;

  sourceId: Types.ObjectId;

  name: string;

  country: string;

  state: string;

  city: string;

  district: string;

  ward: string;

  streetNumber: string;

  streetAddress: string;

  zipCode: string;

  description: string;

  createdAt: Date;

  updatedAt: Date;
}
