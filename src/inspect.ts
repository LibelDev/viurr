import debugFactory from 'debug';
import compact from 'lodash/compact';
import { fetchDistributeWeb } from './apis/video/video.api';
import { fetchAjaxDetail } from './apis/vod/vod.api';
import { IEpisode, ISeries, LanguageFlag } from './types/viu.types';

const debug = debugFactory('viurr:inspect');

/**
 * Inspect the details of a series
 *
 * @async
 * @param {string} productId
 * @returns {Promise<ISeries>} The series details
 */
export const series = async (productId: string): Promise<ISeries> => {
  const vodAjaxDetailResponse = await fetchAjaxDetail({ product_id: productId });
  const { series } = vodAjaxDetailResponse.data;
  if (!series) throw new Error(`Product "${productId}" not found`);
  return {
    title: series.name,
    description: series.description,
    coverImageURL: series.cover_image_url,
    total: parseInt(series.product_total, 10),
    episodes: series.product.map((product) => ({
      productId: product.product_id,
      number: parseInt(product.number, 10),
      title: product.synopsis,
      description: product.description,
      coverImageURL: product.cover_image_url
    }))
  };
};

/**
 * Inspect the details of an episode
 *
 * @async
 * @param {string} productId
 * @returns {Promise<IEpisode>} The episode details
 */
export const episode = async (productId: string): Promise<IEpisode> => {
  const vodAjaxDetailResponse = await fetchAjaxDetail({ product_id: productId });
  const { current_product } = vodAjaxDetailResponse.data;
  if (!current_product) throw new Error(`Product "${productId}" not found`);
  const { ccs_product_id, number: _number, synopsis, description, subtitle, cover_image_url } = current_product;
  const distributeWebResponse = await fetchDistributeWeb({
    ccs_product_id,
    language_flag_id: LanguageFlag.TraditionalChinese
  }, productId);
  const { data, status } = distributeWebResponse;
  if (!data || !status || status.code !== 0) {
    debug('status', status);
    throw new Error(`Cannot fetch the data of product, ID: "${productId}"`);
  }
  const { url } = data.stream;
  const subtitles = compact(subtitle);
  return {
    productId,
    number: parseInt(_number, 10),
    title: synopsis,
    description,
    coverImageURL: cover_image_url,
    urls: url,
    subtitles: subtitles.map((subtitle) => ({
      name: subtitle.name,
      url: subtitle.url,
      languageId: subtitle.product_subtitle_language_id
    }))
  };
};
