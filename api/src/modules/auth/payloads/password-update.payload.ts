import {
  IsString, MinLength, IsNotEmpty, IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordChangePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    source = 'user';

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
    password: string;
}

export class PasswordUserChangePayload {
  @ApiProperty()
  @IsOptional()
  @IsString()
    source: string;

  @ApiProperty()
  @IsString()
    userId: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
    password: string;
}
