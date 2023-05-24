import axios from 'axios';
import debugFactory from 'debug';
import filenamify from 'filenamify';
import fs from 'fs/promises';
import mkdirp from 'mkdirp';
import path from 'path';
import config from './config/config';
import * as inspect from './inspect';
import { flipEnum } from './helpers/enum';
import { encode, type IEncoder, type ISavedSubtitle } from './helpers/ffmpeg';
import { exists, getBaseFilename } from './helpers/file';
import { fetchImageWithMetadata } from './helpers/image';
import { mergeSRTs, patchSrtPosition } from './helpers/subtitle';
import { LanguageFlagId, Quality, SecondSubtitlePosition, SrtSubtitlePosition, SubtitleLanguageCode, SubtitleLanguageName, type IEpisode, type ISeries, type QualityOption } from './types/types';

const debug = debugFactory('viurr:download');

/**
 * Download the video in specific quality
 */
export const video = async (productId: string, quality: QualityOption = '1080p'): Promise<[ISeries, IEpisode, string, IEncoder]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const _quality = Quality[quality];
  const url = episode.urls[_quality];
  const baseFilename = getBaseFilename(episode);
  if (!url) {
    /* tslint:disable-next-line:max-line-length */
    throw new Error(`Quality "${quality}" is not available in ${baseFilename}`);
  }
  debug('video:', url);
  const filename = filenamify.path(`${baseFilename}.mkv`);
  const filepath = path.resolve(process.cwd(), filename);
  if (await exists(filepath)) {
    throw new Error(`${filepath} already exists`);
  }
  debug('video file:', filepath);
  /* download the temporary subtitle files before encoding */
  const subtitles = await Promise.all(
    episode.subtitles.map(async (_subtitle) => {
      const languageName = flipEnum(SubtitleLanguageName)[_subtitle.name];
      const languageId = LanguageFlagId[languageName];
      const [, , filepath] = await subtitle(productId, languageId, true);
      return { ..._subtitle, filepath } as ISavedSubtitle;
    })
  );
  /* start encoding */
  const encoder = await encode(episode, quality, subtitles, filepath);
  /* clean up the temporary subtitle files */
  encoder.on('end', () => {
    subtitles.forEach((subtitle) => fs.unlink(subtitle.filepath));
  });
  return [series, episode, filepath, encoder];
};

/**
 * Download the cover image
 */
export const cover = async (productId: string): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const { coverImageURL } = episode;
  debug('cover image url', coverImageURL);
  const [buffer, , extension] = await fetchImageWithMetadata(coverImageURL);
  const baseFilename = getBaseFilename(episode);
  const filename = filenamify.path(`${baseFilename}.${extension}`);
  const filepath = path.resolve(process.cwd(), filename);
  if (await exists(filepath)) {
    throw new Error(`${filepath} already exists`);
  }
  debug('cover image file:', filepath);
  const directory = path.dirname(filepath);
  await mkdirp(directory);
  await fs.writeFile(filepath, buffer);
  return [series, episode, filepath];
};

/**
 * Download the subtitle in specific language in SRT format
 */
export const subtitle = async (productId: string, languageId: LanguageFlagId, temporary = false): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const { subtitles } = episode;
  const subtitle = subtitles.find(subtitle => subtitle.languageId === languageId);
  const baseFilename = getBaseFilename(episode);
  if (!subtitle) {
    /* tslint:disable-next-line:max-line-length */
    throw new Error(`Language ID "${languageId}" is not available in ${baseFilename}`);
  }
  const { url, secondSubtitleURL, secondSubtitlePosition } = subtitle;
  debug('subtitle url:', url);
  let { data } = await axios.get<string>(url);
  if (secondSubtitleURL) {
    debug('second subtitle url:', secondSubtitleURL);
    const { data: secondarySRT } = await axios.get<string>(secondSubtitleURL);
    const position = flipEnum(SecondSubtitlePosition)[secondSubtitlePosition];
    const patchedSecondarySRT = await patchSrtPosition(secondarySRT, SrtSubtitlePosition[position]);
    data = await mergeSRTs(data, patchedSecondarySRT);
  }
  const filename = filenamify(`${baseFilename}.${SubtitleLanguageCode[subtitle.name]}.srt`);
  const filepath = temporary ? path.join(config.temporaryDirectory, filename) : path.resolve(process.cwd(), filename);
  if (await exists(filepath)) {
    throw new Error(`${filepath} already exists`);
  }
  debug('subtitle file:', filepath);
  const directory = path.dirname(filepath);
  debug('subtitle directory:', directory);
  await mkdirp(directory);
  await fs.writeFile(filepath, data);
  return [series, episode, filepath];
};
