import {
  IsString,
  IsOptional,
  Validate,
  IsEmail,
  IsIn,
  IsArray,
  Min,
  IsNumber,
  IsBoolean,
  IsDateString
} from 'class-validator';
import { Username } from 'src/modules/user/validators/username.validator';
import { GENDERS } from 'src/modules/user/constants';
import { ApiProperty } from '@nestjs/swagger';

export class SelfUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    name: string;

  @ApiProperty()
  @IsString()
  @Validate(Username)
  @IsOptional()
    username: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
    email: string;

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
    password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    phoneCode: string; // international code prefix

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
    city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    zipcode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    address: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
    languages: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
    categoryIds: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
    height: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    weight: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    hair: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    pubicHair: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    butt: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    ethnicity: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    bio: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    eyes: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    bodyType: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    sexualOrientation: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    isFreeSubscription: boolean;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
    durationFreeSubscriptionDays: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
    monthlyPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
    yearlyPrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
    publicChatPrice: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
    dateOfBirth: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    activateWelcomeVideo: boolean;
}

export class PerformerUpdatePayload extends SelfUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
    status: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    verifiedEmail: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    verifiedAccount: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    verifiedDocument: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    isFeatured: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
    commissionPercentage: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
    balance: number;
}
