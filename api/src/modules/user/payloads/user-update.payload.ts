import {
  IsString, IsOptional, IsEmail, Validate, IsIn, IsBoolean, IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Username } from '../validators/username.validator';
import { GENDERS } from '../constants';

export class UserUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
    email: string;

  @ApiProperty()
  @IsString()
  @Validate(Username)
    username: string;

  @ApiProperty()
  @IsString()
  @IsIn(GENDERS)
  @IsOptional()
    gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    password: string;
}

export class AdminUpdatePayload extends UserUpdatePayload {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
    roles: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    verifiedEmail: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
    balance: number;
}
