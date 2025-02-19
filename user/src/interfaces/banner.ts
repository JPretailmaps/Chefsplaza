export interface IBanner {
  _id: string;
  title: string;
  description: string;
  status: string;
  position: string;
  link: string;
  photo: { url: string; thumbnails: string[] };
}
