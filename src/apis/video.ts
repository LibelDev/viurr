import axios, {AxiosAdapter} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import debugFactory from 'debug';
import {apiURL} from '../constants/video';
import {Query, Response} from './video.typings';

const debug = debugFactory('viurr:api:video');

const video = axios.create({
  baseURL: apiURL,
  headers: {
    'Origin': 'https://www.viu.com',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter))
});

/**
 * Request Distribute Web API
 *
 * @public
 * @param {Query} query
 * @returns {Promise<Response>}
 */
export const getDistributeWeb = (query: Query, productId: string): Promise<Response> => {
  const url = 'distribute_web_hk.php';
  const headers = getHeaders(productId);
  const config = {params: query, headers};
  debug('fetching', url, config);
  const promise = video.get(url, config)
    .then(res => res.data);
  promise.then(data => debug(url, data));
  return promise;
};

/**
 * Get the request headers
 *
 * @private
 * @param {string} productId
 * @returns The request headers
 */
function getHeaders (productId: string) {
  const refererBase = 'https://www.viu.com/ott/hk/zh-hk/vod/';
  return {
    Referer: `${refererBase}${productId ? productId + '/' : ''}`
  };
}

export default video;
