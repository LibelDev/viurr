import axios, { AxiosAdapter } from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import debugFactory from 'debug';
import { baseURL } from './video.constants';
import { DistributeWeb } from './video.api.types';

const debug = debugFactory('viurr:api:video');

const video = axios.create({
  baseURL,
  headers: {
    'Origin': 'https://www.viu.com',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter))
});

/**
 * Fetch Distribute Web data
 *
 * @async
 * @public
 * @param {DistributeWeb.IQuery} query
 * @returns {Promise<DistributeWeb.IResponse>}
 */
export const fetchDistributeWeb = async (query: DistributeWeb.IQuery, productId: string): Promise<DistributeWeb.IResponse> => {
  const url = 'distribute_web_hk.php';
  const headers = getHeaders(productId);
  const config = { params: query, headers };
  debug('fetching', url, query);
  const { data } = await video.get<DistributeWeb.IResponse>(url, config);
  return data;
};

/**
 * Get the request headers
 *
 * @private
 * @param {string} productId
 * @returns The request headers
 */
function getHeaders (productId?: string) {
  return {
    Referer: `https://www.viu.com/ott/hk/zh-hk/vod/${productId ? productId + '/' : ''}`
  };
}

export default video;
