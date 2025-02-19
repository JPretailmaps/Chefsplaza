import {
  IsString,
  IsOptional,
  IsEmail,
  Validate,
  IsIn,
  IsNotEmpty,
  IsBoolean,
  IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Username } from '../validators/username.validator';
import { GENDERS } from '../constants';

export class UserRegisterPayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    name: string;

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
  @IsEmail()
  @IsNotEmpty()
    email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    password: string;

  @ApiProperty()
  @IsString()
  @Validate(Username)
  @IsOptional()
    username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(GENDERS)
    gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    phone: string;
}

export class UserCreatePayload extends UserRegisterPayload {
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
