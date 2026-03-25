export interface Moment {
  id: string;
  title: string;
  short: string;
  full: string;
  date: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  date: string;
}

export type Page = 'home' | 'timeline' | 'gallery' | 'secret-letter';
