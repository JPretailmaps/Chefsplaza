import { Types } from 'mongoose';
import {
  IsOptional, IsArray, IsNotEmpty
} from 'class-validator';

export class PerformerBlockCountriesPayload {
  @IsArray()
  @IsNotEmpty()
    countryCodes: string[];

  @IsArray()
  @IsOptional()
    performerId: string | Types.ObjectId;
}
