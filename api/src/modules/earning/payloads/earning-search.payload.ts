import { SearchRequest } from 'src/kernel/common';
import { Types } from 'mongoose';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EarningSearchRequestPayload extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
    performerId?: string | Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
    transactionId?: string | Types.ObjectId;

  @ApiProperty()
  @IsString()
  @IsOptional()
    sourceType?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    type?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
    fromDate?: string | Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
    toDate?: string | Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
    paidAt?: string | Date;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    isPaid?: boolean;

  isToken?: any;
}

export class UpdateEarningStatusPayload {
  @IsString()
  @IsOptional()
    performerId: string;

  @IsString()
  @IsNotEmpty()
    fromDate: string | Date;

  @IsString()
  @IsNotEmpty()
    toDate: string | Date;
}
