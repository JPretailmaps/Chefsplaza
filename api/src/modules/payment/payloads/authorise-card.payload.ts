import {
  IsNotEmpty, IsOptional, IsString
} from 'class-validator';
import { SearchRequest } from 'src/kernel';

export class AuthoriseCardPayload {
  @IsString()
  @IsNotEmpty()
    token: string;

  @IsString()
  @IsOptional()
    holderName: string;

  @IsString()
  @IsNotEmpty()
    last4Digits: string;

  @IsString()
  @IsNotEmpty()
    brand: string;

  @IsString()
  @IsNotEmpty()
    month: string;

  @IsString()
  @IsNotEmpty()
    year: string;

  @IsString()
  @IsNotEmpty()
    paymentGateway: string;
}

export class SearchCardRequest extends SearchRequest {
  @IsString()
  @IsOptional()
    isProduction: string;

  @IsString()
  @IsOptional()
    paymentGateway: string;
}
