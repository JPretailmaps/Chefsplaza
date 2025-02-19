import { IPerformer } from './performer';

export interface IGallery {
  _id: string;
  title: string;
  description: string;
  status: string;
  price: number;
  isSale: boolean;
  performerId: string;
  coverPhoto: { thumbnails: string[]; url: string };
  slug: string;
  performer: IPerformer;
}
