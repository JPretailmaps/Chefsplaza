import { IsString } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';

export class CommentSearchRequestPayload extends SearchRequest {
  @IsString()
    objectId: string;

  @IsString()
    objectType: string;
}
