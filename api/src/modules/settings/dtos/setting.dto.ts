import { Types } from 'mongoose';
import { pick } from 'lodash';

export class SettingDto {
  _id: Types.ObjectId;

  key: string;

  value: any;

  oldValue?: any; // to compare

  name: string;

  description: string;

  group: string;

  public = false;

  type = 'text';

  visible = true;

  meta: any;

  createdAt: Date;

  updatedAt: Date;

  extra: string;

  autoload: boolean;

  ordering: number;

  constructor(data?: Partial<SettingDto>) {
    data && Object.assign(this, pick(data, [
      '_id', 'key', 'value', 'oldValue', 'name', 'description', 'type', 'visible', 'public', 'meta', 'createdAt', 'updatedAt', 'extra',
      'autoload', 'ordering', 'group'
    ]));
  }

  public getValue() {
    if (this.type === 'text' && !this.value) {
      return '';
    }

    return this.value;
  }
}
