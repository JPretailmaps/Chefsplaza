import { Types } from 'mongoose';
import { FileDto } from './file.dto';

export class FileResponseDto {
  _id?: string | Types.ObjectId;

  url?: string;

  thumbnailUrl?: string;

  static fromFile(file: FileDto): FileResponseDto {
    if (!file) return null;

    return {
      _id: file._id,
      url: file.getUrl(),
      // TODO - implement me
      thumbnailUrl: null
    };
  }
}
