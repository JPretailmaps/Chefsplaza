import { SearchRequest } from 'src/kernel/common';
import {
  IsString, IsOptional, IsNotEmpty, IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { REPORT_TARGET } from '../constants';

export class ReportSearchRequestPayload extends SearchRequest {
  targetId: string;

  target: string;

  source: string;

  sourceId: string;

  performerId: string;
}

export class ReportCreatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn([
    REPORT_TARGET.FEED,
    REPORT_TARGET.COMMENT,
    REPORT_TARGET.GALLERY,
    REPORT_TARGET.VIDEO,
    REPORT_TARGET.GALLERY,
    REPORT_TARGET.PRODUCT
  ])
    target = REPORT_TARGET.FEED;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    targetId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    performerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    description: string;
}
