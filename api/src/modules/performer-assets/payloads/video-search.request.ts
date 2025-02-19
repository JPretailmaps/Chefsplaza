import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class VideoSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
    performerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    excludedId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    isSale: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    fromDate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    toDate: string;
}
