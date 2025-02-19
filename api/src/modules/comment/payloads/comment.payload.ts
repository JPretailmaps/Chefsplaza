import {
  IsString, IsOptional, IsNotEmpty
} from 'class-validator';

export class CommentCreatePayload {
  @IsString()
  @IsNotEmpty()
    content: string;

  @IsString()
  @IsOptional()
    objectType: string;

  @IsString()
  @IsNotEmpty()
    objectId: string;
}

export class CommentEditPayload {
  @IsString()
  @IsNotEmpty()
    content: string;

  @IsString()
  @IsOptional()
    objectType: string;
}
