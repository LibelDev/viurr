export enum Quality {
  '1080p' = 's1080p',
  '720p' = 's720p',
  '480p' = 's480p',
  '240p' = 's240p'
}

export type QualityChoice = keyof typeof Quality;

export enum Language {
  TC = '1'
}

export type LanguageChoice = keyof typeof Language;
