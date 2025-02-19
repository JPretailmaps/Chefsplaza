import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class FeedSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
    performerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    isHome: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
    fromDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
    toDate: string;
}
