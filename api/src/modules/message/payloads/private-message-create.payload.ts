import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { MessageCreatePayload } from './message-create.payload';

export class PrivateMessageCreatePayload extends MessageCreatePayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
    recipientId: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
    recipientType: string;
}
