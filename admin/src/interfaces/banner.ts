export interface IBanner {
  _id: string;
  title: string;
  status: string;
  description: string;
  thumbnail: string;
  photo: { url: string; thumbnails: string[] };
  position: string;
}
