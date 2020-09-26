import axios from 'axios';
import debugFactory from 'debug';
import filenamify from 'filenamify';
import fs from 'fs';
import flatMap from 'lodash/flatMap';
import mkdirp from 'mkdirp';
import mustache from 'mustache';
import path from 'path';
import * as inspect from './inspect';
import exists from './lib/exists';
import { encode } from './lib/ffmpeg';
import { fetchImageWithMetadata } from './lib/image';
import { IEpisode, ISeries, Quality, QualityOption, LanguageFlag, SubtitleLanguageCode } from './types/viu.types';

const debug = debugFactory('viurr:download');

const { writeFile } = fs.promises;

/**
 * Download the video in specific quality
 *
 * @async
 * @param {string} productId
 * @param {string} [filepath] default: episode title
 * @param {QualityOption} [quality] default: `"1080p"`
 * @returns {Promise<[ISeries, IEpisode, string, ReturnType<typeof encode>]>}
 */
export const video = async (productId: string, filepath?: string, quality: QualityOption = '1080p'): Promise<[ISeries, IEpisode, string, ReturnType<typeof encode>]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const _quality = Quality[quality];
  const url = episode.urls[_quality];
  if (!url) {
    /* tslint:disable-next-line:max-line-length */
    throw new Error(`Quality "${quality}" is not available in EP.${episode.number} "${episode.title}" (${series.title})`);
  }
  debug('playlist:', url);
  const filenameTemplateValues = {
    ...getFilenameTemplateValues(series, episode),
    QUALITY: quality
  };
  const fileExtension = 'mkv';
  let _filepath = filenamify.path(filepath || `${episode.number}-${episode.title}.${fileExtension}`);
  _filepath = mustache.render(_filepath, filenameTemplateValues);
  if (await exists(_filepath)) {
    throw new Error(`${_filepath} already exists`);
  }
  _filepath = path.resolve(_filepath);
  debug('video file:', _filepath);
  const directory = path.dirname(_filepath);
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
  const encoder = encode(args, _filepath);
  return [series, episode, _filepath, encoder];
};

/**
 * Download the cover image
 *
 * @async
 * @param {string} productId
 * @param {string} [filename] default: episode title
 * @returns {Promise<[ISeries, IEpisode, string]>}
 */
export const cover = async (productId: string, filepath?: string): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const { coverImageURL } = episode;
  debug('cover image url', coverImageURL);
  const [buffer, , extension] = await fetchImageWithMetadata(coverImageURL);
  const filenameTemplateValues = {
    ...getFilenameTemplateValues(series, episode),
    EXT: extension
  };
  const fileExtension = extension;
  let _filepath = filenamify.path(filepath || `${episode.number}-${episode.title}.${fileExtension}`);
  _filepath = mustache.render(_filepath, filenameTemplateValues);
  if (await exists(_filepath)) {
    throw new Error(`${_filepath} already exists`);
  }
  _filepath = path.resolve(_filepath);
  debug('cover image file:', _filepath);
  const directory = path.dirname(_filepath);
  await mkdirp(directory);
  await writeFile(_filepath, buffer);
  return [series, episode, _filepath];
};

/**
 * Download the subtitle in specific language in SRT format
 *
 * @async
 * @param {string} productId
 * @param {string} [filepath] default: episode title
 * @param {LanguageFlag} [languageId] default: LanguageFlag.TraditionalChinese
 * @returns {Promise<[ISeries, IEpisode, string]>} The output filepath
 */
export const subtitle = async (productId: string, filepath?: string, languageId: LanguageFlag = LanguageFlag.TraditionalChinese): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const { subtitles } = episode;
  const subtitle = subtitles.find(subtitle => subtitle.languageId === languageId);
  if (!subtitle) {
    /* tslint:disable-next-line:max-line-length */
    throw new Error(`Language ID "${languageId}" is not available in episode #.${episode.number} "${episode.title}" (${series.title})`);
  }
  debug('subtitle url:', subtitle.url);
  const { data } = await axios.get(subtitle.url);
  const filenameTemplateValues = {
    ...getFilenameTemplateValues(series, episode),
    SUBTITLE_NAME: subtitle.name,
    LANGUAGE_CODE: SubtitleLanguageCode[subtitle.name]
  };
  const fileExtension = 'srt';
  let _filepath = filenamify(filepath || `${episode.number}-${episode.title}.${SubtitleLanguageCode[subtitle.name]}.${fileExtension}`);
  _filepath = mustache.render(_filepath, filenameTemplateValues);
  if (await exists(_filepath)) {
    throw new Error(`${_filepath} already exists`);
  }
  _filepath = path.resolve(_filepath);
  debug('subtitle file:', _filepath);
  const directory = path.dirname(_filepath);
  debug('subtitle directory:', directory);
  await mkdirp(directory);
  await writeFile(_filepath, data);
  return [series, episode, _filepath];
};

/**
 * Save the description as plain text file
 *
 * @async
 * @param {string} productId
 * @param {string} filepath
 * @returns {Promise<[ISeries, IEpisode, string]>} The output filepath
 */
export const description = async (productId: string, filepath: string): Promise<[ISeries, IEpisode, string]> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const filenameTemplateValues = getFilenameTemplateValues(series, episode);
  const fileExtension = 'txt';
  let _filepath = filenamify.path(filepath || `${episode.number}-${episode.title}.${fileExtension}`);
  _filepath = mustache.render(_filepath, filenameTemplateValues);
  if (await exists(_filepath)) {
    throw new Error(`${_filepath} already exists`);
  }
  _filepath = path.resolve(_filepath);
  debug('description file:', _filepath);
  const directory = path.dirname(_filepath);
  debug('description directory:', directory);
  await mkdirp(directory);
  await writeFile(_filepath, episode.description);
  return [series, episode, _filepath];
};

/**
 * Get the basic supported filepath template values
 *
 * @private
 * @returns Template values
 */
function getFilenameTemplateValues (series: ISeries, episode: IEpisode) {
  return {
    PRODUCT_ID: episode.productId,
    SERIES_TITLE: series.title,
    EPISODE_TITLE: episode.title,
    EPISODE_NUMBER: episode.number
  };
}
