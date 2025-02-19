import { Types } from 'mongoose';

export class AuthCreateDto {
  source = 'user';

  sourceId: Types.ObjectId;

  type? = 'password';

  key?: string;

  value?: string;

  constructor(data: Partial<AuthCreateDto>) {
    this.source = data.source || 'user';
    this.type = data.type || 'password';
    this.sourceId = data.sourceId;
    this.key = data.key;
    this.value = data.value;
  }
}
