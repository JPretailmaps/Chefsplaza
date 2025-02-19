import {
  IsString,
  IsOptional,
  Validate,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsNumber,
  Min,
  IsBoolean
} from 'class-validator';
import { Username } from 'src/modules/user/validators/username.validator';
import { ApiProperty } from '@nestjs/swagger';
import { PERFORMER_STATUSES } from '../constants';

export class PerformerRegisterPayload {
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
  @IsOptional()
  @Validate(Username)
  @IsNotEmpty()
    username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
    email: string;

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
  @IsNotEmpty()
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
  @IsString({ each: true })
  @IsOptional()
    languages: string[];

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
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
    sexualOrientation: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
    isFreeSubscription: boolean;

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
  @IsString()
  @IsOptional()
    dateOfBirth: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    avatarId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    idVerificationId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    documentVerificationId: string;
}

export class PerformerCreatePayload extends PerformerRegisterPayload {
  @ApiProperty()
  @IsString()
  @IsIn([PERFORMER_STATUSES.ACTIVE, PERFORMER_STATUSES.INACTIVE, PERFORMER_STATUSES.PENDING])
  @IsOptional()
    status = PERFORMER_STATUSES.ACTIVE;

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
