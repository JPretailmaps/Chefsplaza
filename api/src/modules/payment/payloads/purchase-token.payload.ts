import {
  IsNotEmpty,
  IsNumber,
  IsOptional, IsString
} from 'class-validator';

export class PurchaseTokenPayload {
  @IsNumber()
  @IsNotEmpty()
    amount: number;

  @IsString()
  @IsOptional()
    cardId: string;

  @IsString()
  @IsOptional()
    couponCode: string;

  @IsString()
  @IsOptional()
    paymentGateway: string;
}
