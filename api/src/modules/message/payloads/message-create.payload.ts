import {
  IsString, IsOptional, ValidateIf, IsNotEmpty, IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MESSAGE_TYPE } from '../constants';

export class MessageCreatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    type = MESSAGE_TYPE.TEXT;

  @ApiProperty()
  @ValidateIf((o) => o.type === MESSAGE_TYPE.TEXT)
  @IsNotEmpty()
  @IsString()
    text: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
    fileIds: Types.ObjectId[];
}
