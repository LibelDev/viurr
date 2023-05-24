import type { PlaybackDistributeAPI } from '../apis/apis.types';

export interface ISubtitle {
  name: SubtitleLanguageName;
  url: string;
  languageId: string;
  secondSubtitleURL: string;
  secondSubtitlePosition: SecondSubtitlePosition;
}

export interface IEpisodeBase {
  productId: string;
  number: number;
  seriesTitle: string;
  title: string;
  description: string;
  coverImageURL: string;
}

export interface IEpisode extends IEpisodeBase {
  urls: PlaybackDistributeAPI.TURL;
  subtitles: ISubtitle[];
  seriesTags: {
    type: string;
    tags: string[];
  }[];
}

export interface ISeries {
  title: string;
  description: string;
  coverImageURL: string;
  total: number;
  episodes: IEpisodeBase[];
  seriesTags: {
    type: string;
    tags: string[];
  }[];
}

export enum Quality {
  '1080p' = 's1080p',
  '720p' = 's720p',
  '480p' = 's480p',
  '240p' = 's240p'
}

export type QualityOption = keyof typeof Quality;

export enum LanguageFlagId {
  TraditionalChinese = '1',
  English = '3',
  Indonesian = '7',
  Thai = '8'
}

/** the values for MKV track */
export enum SubtitleLanguageCode {
  '繁體中文' = 'chi', // 1
  'English' = 'eng', // 3
  'Indo' = 'ind', // 7
  'ภาษาไทย' = 'tha', // 8
  'Undefined' = 'und' // default
}

/** the values from API response */
export enum SubtitleLanguageName {
  TraditionalChinese = '繁體中文',
  English = 'English',
  Indonesian = 'Indo',
  Thai = 'ภาษาไทย',
}

/** the values from API response */
export enum SecondSubtitlePosition {
  Top = 0
}

/** the values for SRT subtitle */
export enum SrtSubtitlePosition {
  Top = 8
}

export enum Platform {
  Browser = 'browser'
}

export enum PlatformFlagLabel {
  Web = 'web',
  Phone = 'phone'
}
