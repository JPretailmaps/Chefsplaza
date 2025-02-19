export interface IFile {
  _id: string;

  uid: string;

  type: string; // video, podcast, file, etc...

  name: string;

  description: string;

  mimeType: string;

  server: string;

  width: number; // for video, img

  height: number; // for video, img

  duration: number;

  size: number;

  status: string;

  thumbnails: Record<string, any>[];

  metadata: any;

  url: string;

  createdAt: Date;

  updatedAt: Date;

  percent: number;
}
