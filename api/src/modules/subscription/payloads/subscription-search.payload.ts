import {
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SearchRequest } from 'src/kernel';

export class SubscriptionSearchRequestPayload extends SearchRequest {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
    userIds: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
    userId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    performerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    transactionId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    subscriptionId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    subscriptionType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    paymentGateway: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    fromDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    toDate: string;
}
