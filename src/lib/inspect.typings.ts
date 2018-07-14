import {Response} from '../apis/video.typings';

interface Subtitle {
  name: string;
  url: string;
  languageId: string;
}

export interface Episode {
  productId: string;
  number: number;
  title: string;
  description: string;
  coverImageURL: string;
  urls: Response['data']['stream']['url'];
  subtitles: Subtitle[];
}

export interface Series {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
}
