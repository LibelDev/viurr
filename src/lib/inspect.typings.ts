import {Response, URL} from '../apis/video.typings';

interface Subtitle {
  name: string;
  url: string;
  languageId: string;
}

interface BasicEpisode {
  productId: string;
  number: number;
  title: string;
  description: string;
  coverImageURL: string;
}

export interface Episode extends BasicEpisode {
  urls: URL;
  subtitles: Subtitle[];
}

export interface Series {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
  episodes: BasicEpisode[];
}
