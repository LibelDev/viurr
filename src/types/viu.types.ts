import { DistributeWeb } from '../apis/video/video.api.types';

export interface ISubtitle {
  name: keyof typeof SubtitleLanguageCode;
  url: string;
  languageId: string;
}

interface IEpisodeBase {
  productId: string;
  number: number;
  title: string;
  description: string;
  coverImageURL: string;
}

export interface IEpisode extends IEpisodeBase {
  urls: DistributeWeb.IURL;
  subtitles: ISubtitle[];
}

export interface ISeries {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
  episodes: IEpisodeBase[];
}

export enum Quality {
  '1080p' = 's1080p',
  '720p' = 's720p',
  '480p' = 's480p',
  '240p' = 's240p'
}

export type QualityOption = keyof typeof Quality;

export enum LanguageFlag {
  TraditionalChinese = '1',
  English = '3',
  Indonesian = '7',
  Thai = '8'
}

export enum SubtitleLanguageCode {
  '繁體中文' = 'chi', // 1
  'English' = 'eng', // 3
  'Indo' = 'ind', // 7
  'ภาษาไทย' = 'tha', // 8
  'Undefined' = 'und' // default
}
