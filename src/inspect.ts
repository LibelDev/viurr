import debugFactory from 'debug';
import { fetchAuthToken, fetchMobile, fetchPlaybackDistribute, fetchProductPageProps } from './apis/apis';
import { getAuthorizationHeader } from './lib/http';
import { IEpisode, ISeries } from './types/viu.types';

const debug = debugFactory('viurr:inspect');

/**
 * Inspect the details of a series
 */
export const series = async (productId: string): Promise<ISeries> => {
  const { productAltLangList, productDetail } = await fetchProductPageProps(productId);
  const { data: { product } } = productAltLangList;
  const { data: { series } } = productDetail;
  const { data: { product_list } } = await fetchMobile({
    area_id: product[0].area_id,
    language_flag_id: product[0].language_flag_id,
    areaId: product[0].area_id,
    languageFlagId: product[0].language_flag_id,
    r: '/vod/product-list',
    series_id: series.series_id,
    size: -1,
    sort: 'desc'
  });
  return {
    title: series.name,
    description: series.description,
    coverImageURL: series.cover_image_url,
    total: parseInt(series.product_total, 10),
    episodes: product_list.map((product) => ({
      productId: product.product_id,
      number: parseInt(product.number, 10),
      seriesTitle: series.name,
      title: product.synopsis,
      description: product.description,
      coverImageURL: product.cover_image_url
    }))
  };
};

/**
 * Inspect the details of an episode
 */
export const episode = async (productId: string): Promise<IEpisode> => {
  const { productAltLangList, productDetail } = await fetchProductPageProps(productId);
  const { data: { product } } = productAltLangList;
  const { data: { current_product, series } } = productDetail;
  const { token } = await fetchAuthToken({
    area_id: product[0].area_id,
    language_flag_id: product[0].language_flag_id,
    areaId: product[0].area_id,
    languageFlagId: product[0].language_flag_id
  });
  const { data, status } = await fetchPlaybackDistribute({
    area_id: product[0].area_id,
    language_flag_id: product[0].language_flag_id,
    areaId: product[0].area_id,
    languageFlagId: product[0].language_flag_id,
    ut: 1,
    ccs_product_id: current_product.ccs_product_id
  }, getAuthorizationHeader(token));
  if (!data || !status || status.code !== 0) {
    debug('status', status);
    throw new Error(`Cannot fetch the data of product, ID: "${productId}"`);
  }
  return {
    productId,
    number: parseInt(current_product.number, 10),
    seriesTitle: series.name,
    title: current_product.synopsis,
    description: current_product.description,
    coverImageURL: current_product.cover_image_url,
    urls: data.stream.url,
    subtitles: current_product.subtitle.map((subtitle) => ({
      name: subtitle.name,
      url: subtitle.url,
      languageId: subtitle.product_subtitle_language_id
    }))
  };
};
