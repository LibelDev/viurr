import axios from 'axios';
import debugFactory from 'debug';
import filenamify from 'filenamify';
import fs from 'fs';
import flatMap from 'lodash/flatMap';
import mkdirp from 'mkdirp';
import path from 'path';
import * as inspect from './inspect';
import { encode } from './lib/ffmpeg';
import { exists, getBaseFilename } from './lib/file';
import { fetchImageWithMetadata } from './lib/image';
import { IEpisode, ISeries, LanguageFlagId, Quality, QualityOption, SubtitleLanguageCode } from './types/viu.types';

const debug = debugFactory('viurr:download');

const { writeFile } = fs.promises;

/**
 * Download the video in specific quality
 */
export const video = async (productId: string, quality: QualityOption = '1080p'): Promise<[ISeries, IEpisode, string, ReturnType<typeof encode>]> => {
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
  const directory = path.dirname(filepath);
  await mkdirp(directory);
  const [, mimeType, extension] = await fetchImageWithMetadata(episode.coverImageURL);
  const args = [
    '-i', url,
    ...flatMap(episode.subtitles, (subtitle) => ['-i', subtitle.url]),
    '-attach', episode.coverImageURL,
    '-metadata', `title=${episode.title}`,
    '-metadata', `description=${episode.description}`,
    '-metadata:s:t:0', `mimetype=${mimeType}`,
    '-metadata:s:t:0', `filename=cover.${extension}`
  ];
  for (let i = 0; i < episode.subtitles.length; i++) {
    const subtitle = episode.subtitles[i];
    const start = args.length - 2;
    args.splice(
      start, 0,
      `-metadata:s:s:${i}`, `title=${subtitle.name}`,
      `-metadata:s:s:${i}`, `language=${SubtitleLanguageCode[subtitle.name] || SubtitleLanguageCode.Undefined}`
    );
  }
  args.push('-f', 'matroska');
  args.push('-c', 'copy');
  const encoder = encode(args, filepath);
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
  await writeFile(filepath, buffer);
  return [series, episode, filepath];
};

/**
 * Download the subtitle in specific language in SRT format
 */
export const subtitle = async (productId: string, languageId: LanguageFlagId): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const { subtitles } = episode;
  const subtitle = subtitles.find(subtitle => subtitle.languageId === languageId);
  const baseFilename = getBaseFilename(episode);
  if (!subtitle) {
    /* tslint:disable-next-line:max-line-length */
    throw new Error(`Language ID "${languageId}" is not available in ${baseFilename}`);
  }
  debug('subtitle url:', subtitle.url);
  const { data } = await axios.get(subtitle.url);
  const filename = filenamify(`${baseFilename}.${SubtitleLanguageCode[subtitle.name]}.srt`);
  const filepath = path.resolve(process.cwd(), filename);
  if (await exists(filepath)) {
    throw new Error(`${filepath} already exists`);
  }
  debug('subtitle file:', filepath);
  const directory = path.dirname(filepath);
  debug('subtitle directory:', directory);
  await mkdirp(directory);
  await writeFile(filepath, data);
  return [series, episode, filepath];
};
