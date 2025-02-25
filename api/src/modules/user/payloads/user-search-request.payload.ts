import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class UserSearchRequestPayload extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
    role: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    verifiedEmail: string;
}
