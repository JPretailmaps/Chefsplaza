import { IGallery } from './gallery';
import { IPerformer } from './performer';

export interface IPhoto {
  _id: string;
  title: string;
  performerId: string;
  performer: IPerformer;
  status: string;
  description: string;
  galleryId: string;
  gallery: IGallery;
  photo: { url: string; thumbnails: string[] };
  price: number;
}
