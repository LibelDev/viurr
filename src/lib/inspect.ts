import {getDistributeWeb} from '../apis/video';
import getVodAjaxDetail from '../apis/vod/AjaxDetail';
import {Episode, Series} from './inspect.typings';

/**
 * Inspect the details of a series
 *
 * @param {string} productId
 * @returns {Promise<Series>}
 */
export const series = async (productId: string): Promise<Series> => {
  const vodAjaxDetailResponse = await getVodAjaxDetail({product_id: productId});
  const {name, description, cover_image_url, product_total, product} = vodAjaxDetailResponse.data.series;
  return {
    title: name,
    description: description,
    coverImageURL: cover_image_url,
    total: parseInt(product_total)
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
  const {ccs_product_id, number, synopsis, description, subtitle, cover_image_url} = vodAjaxDetailResponse.data.current_product;
  const distributeWebResponse = await getDistributeWeb({ccs_product_id});
  const {url} = distributeWebResponse.data.stream;
  return {
    productId,
    number: parseInt(number),
    title: synopsis,
    description: description,
    coverImageURL: cover_image_url,
    urls: url,
    subtitles: subtitle.map((subtitle) => {
      return {
        name: subtitle.name,
        url: subtitle.url,
        languageId: subtitle.product_subtitle_language_id
      }
    })
  };
};
