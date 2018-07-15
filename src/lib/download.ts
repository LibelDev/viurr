import axios from 'axios';
import Debugger from 'debug';
import fs from 'fs';
import mime from 'mime';
import mkdirp from 'mkdirp-promise';
import mustache from 'mustache';
import path from 'path';
import util from 'util';
import {Quality, QualityChoice} from '../config/config';
import {encode} from './ffmpeg';
import * as inspect from './inspect';
import {Episode, Series} from './inspect.typings';

const debug = Debugger('viuer:lib:download');

const writeFile = util.promisify(fs.writeFile);

/**
 * Download the video in specific quality
 *
 * @param {string} productId
 * @param {string} filePathTemplate
 * @param {QualityChoice} quality
 * @returns {Promise<string>}
 */
export const video = async (productId: string, filePathTemplate: string, quality: QualityChoice): Promise<string> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const qualityKey = Quality[quality];
  const url = episode.urls[qualityKey];
  if (!url) throw new Error(`Quality "${quality}" is not available in EP.${episode.number} "${episode.title}" (${series.title})`);
  debug('playlist url :', url);
  const basicTemplateValues = getBasicFilePathTemplateValues(series, episode);
  const templateValues = {
    ...basicTemplateValues,
    QUALITY: quality
  };
  const filePath = mustache.render(filePathTemplate, templateValues);
  const _filePath = path.resolve(filePath);
  debug('video file :', _filePath);
  const directory = path.dirname(_filePath);
  debug('video directory :', directory);
  await mkdirp(directory);
  await encode(url, _filePath);
  return _filePath;
};

// /**
//  * Download the videos in specific qualities
//  * (wrapper of `video()` for multiple qualities)
//  *
//  * @param {string} productId
//  * @param {string} filePathTemplate
//  * @param {QualityChoice[]} qualities
//  * @returns {Promise<string[]>}
//  */
// export const videos = async (productId: string, filePathTemplate: string, qualities: QualityChoice[]): Promise<string[]> => {
//   const filePaths = [];
//   for (const quality of qualities) {
//     const filePath = await video(productId, filePathTemplate, quality);
//     filePaths.push(filePath);
//   }
//   return filePaths;
// };

/**
 * Download the cover image
 *
 * @param {string} productId
 * @param {string} filePathTemplate
 * @returns {Promise<string>}
 */
export const cover = async (productId: string, filePathTemplate: string): Promise<string> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const {coverImageURL} = episode;
  debug('cover image url', coverImageURL);
  const {headers, data} = await axios.get(coverImageURL, {responseType: 'arraybuffer'});
  const type = headers['Content-Type'] || headers['content-type'];
  const extenstion = mime.getExtension(type);
  const basicTemplateValues = getBasicFilePathTemplateValues(series, episode);
  const templateValues = {
    ...basicTemplateValues,
    EXT: extenstion
  };
  const filePath = mustache.render(filePathTemplate, templateValues);
  const _filePath = path.resolve(filePath);
  debug('cover image file :', _filePath);
  const directory = path.dirname(_filePath);
  debug('cover image directory :', directory);
  await mkdirp(directory);
  const buffer = Buffer.from(data, 'binary');
  await writeFile(_filePath, buffer, {flag: 'wx'});
  return _filePath;
};

/**
 * Download the subtitle in specific language
 *
 * @param {string} productId
 * @param {string} filePathTemplate
 * @param {string} languageId
 * @returns {Promise<string>}
 */
export const subtitle = async (productId: string, filePathTemplate: string, languageId: string): Promise<string> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const {subtitles} = episode;
  const subtitle = subtitles.find(subtitle => subtitle.languageId === languageId);
  if (!subtitle) throw new Error(`Language ID "${languageId}" is not available in EP.${episode.number} "${episode.title}" (${series.title})`);
  debug('subtitle url :', subtitle.url);
  const {data} = await axios.get(subtitle.url);
  const basicTemplateValues = getBasicFilePathTemplateValues(series, episode);
  const templateValues = {
    ...basicTemplateValues,
    SUBTITLE_NAME: subtitle.name
  };
  const filePath = mustache.render(filePathTemplate, templateValues);
  const _filePath = path.resolve(filePath);
  debug('subtitle file :', _filePath);
  const directory = path.dirname(_filePath);
  debug('subtitle directory :', directory);
  await mkdirp(directory);
  await writeFile(_filePath, data, {flag: 'wx'});
  return _filePath;
};

// /**
//  * Download the subtitles in specific languages
//  * (wrapper of `subtitle()` for all available languages)
//  *
//  * @param {string} productId
//  * @param {string} filePathTemplate
//  * @returns {Promise<string[]>}
//  */
// export const subtitles = async (productId: string, filePathTemplate: string): Promise<string[]> => {
//   const episode = await inspect.episode(productId);
//   const {subtitles} = episode;
//   const filePaths = [];
//   for (const {languageId} of subtitles) {
//     const filePath = await subtitle(productId, filePathTemplate, languageId);
//     filePaths.push(filePath);
//   }
//   return filePaths;
// };

/**
 * Save the description as plain text file
 *
 * @param {string} productId
 * @param {string} filePathTemplate
 * @returns {Promise<string>}
 */
export const description = async (productId: string, filePathTemplate: string): Promise<string> => {
  const series = await inspect.series(productId);
  const episode = await inspect.episode(productId);
  const templateValues = getBasicFilePathTemplateValues(series, episode);
  const filePath = mustache.render(filePathTemplate, templateValues);
  const _filePath = path.resolve(filePath);
  debug('description file :', _filePath);
  const directory = path.dirname(_filePath);
  debug('description directory :', directory);
  await mkdirp(directory);
  await writeFile(_filePath, episode.description, {flag: 'wx'});
  return _filePath;
};

/**
 * Get the basic supported file path template values
 *
 * @param {Series} series
 * @param {Episode} episode
 * @returns Template values
 */
function getBasicFilePathTemplateValues (series: Series, episode: Episode) {
  return {
    PRODUCT_ID: episode.productId,
    SERIES_TITLE: series.title,
    EPISODE_TITLE: episode.title,
    EPISODE_NUMBER: episode.number
  };
}
