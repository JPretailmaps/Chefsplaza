import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsIn,
  IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MENU_SECTION } from '../constants';

export class MenuUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
    path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn([MENU_SECTION.MAIN, MENU_SECTION.HEADER, MENU_SECTION.FOOTER])
    section: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
    internal: boolean;

  // @ApiProperty()
  // @IsBoolean()
  // @IsNotEmpty()
  // public: boolean;

  // @ApiProperty()
  // @IsBoolean()
  // isPage: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
    parentId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
    help: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
    ordering: number;

  @ApiProperty()
  @IsBoolean()
    isNewTab: boolean;
}
