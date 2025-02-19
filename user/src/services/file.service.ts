import { APIRequest } from './api-request';

export class FileService extends APIRequest {
  getFileStatus(fileId: string, query: any) {
    return this.get(this.buildUrl(`/files/${fileId}/status`, query));
  }
}

export const fileService = new FileService();
