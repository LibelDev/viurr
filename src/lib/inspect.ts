import Debugger from 'debug';
import compact from 'lodash/compact';
import {getDistributeWeb} from '../apis/video';
import getVodAjaxDetail from '../apis/vod/AjaxDetail';
import {Episode, Series} from './inspect.typings';

const debug = Debugger('viuer:lib:inspect');

/**
 * Inspect the details of a series
 *
 * @param {string} productId
 * @returns {Promise<Series>}
 */
export const series = async (productId: string): Promise<Series> => {
  const vodAjaxDetailResponse = await getVodAjaxDetail({product_id: productId});
  const {series} = vodAjaxDetailResponse.data;
  if (!series) throw new Error(`Product "${productId}" not found`);
  const {name, description, cover_image_url, product_total, product} = series;
  return {
    title: name,
    description: description,
    coverImageURL: cover_image_url,
    total: parseInt(product_total),
    episodes: product.map((product) => {
      return {
        productId: product.product_id,
        number: parseInt(product.number),
        title: product.synopsis,
        description: product.description,
        coverImageURL: product.cover_image_url
      }
    })
  };
};

/**
 * Inspect the details of an episode
 *
 * @param {string} productId
 * @returns {Promise<Episode>}
 */
export const episode = async (productId: string): Promise<Episode> => {
  const vodAjaxDetailResponse = await getVodAjaxDetail({product_id: productId});
  const {current_product} = vodAjaxDetailResponse.data;
  if (!current_product) throw new Error(`Product "${productId}" not found`);
  const {ccs_product_id, number, synopsis, description, subtitle, cover_image_url} = current_product;
  const distributeWebResponse = await getDistributeWeb({ccs_product_id});
  const {url} = distributeWebResponse.data.stream;
  const subtitles = compact(subtitle);
  return {
    productId,
    number: parseInt(number),
    title: synopsis,
    description: description,
    coverImageURL: cover_image_url,
    urls: url,
    subtitles: subtitles.map((subtitle) => {
      return {
        name: subtitle.name,
        url: subtitle.url,
        languageId: subtitle.product_subtitle_language_id
      }
    })
  };
};
