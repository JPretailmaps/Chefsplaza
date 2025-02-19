import {
  IsString,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class PaymentGatewaySettingPayload {
  @IsString()
  @IsOptional()
    performerId: string;

  @IsString()
  @IsNotEmpty()
    key: string;

  @IsString()
  @IsOptional()
    status: string;

  @IsNotEmpty()
    value: any;
}
