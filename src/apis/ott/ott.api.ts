import axios, { AxiosAdapter } from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import debugFactory from 'debug';
import { baseURL } from './ott.constants';
import { Index, PlatformFlagLabel } from './ott.api.types';

const debug = debugFactory('viurr:api:ott');

const ott = axios.create({
  baseURL,
  headers: {
    'Origin': 'https://www.viu.com',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter))
});

/**
 * Fetch OTT Index data
 *
 * @async
 * @public
 * @param {Index.IQuery} query
 * @returns {Promise<Index.IResponse>}
 */
export const fetchIndex = async (query: Index.IQuery): Promise<Index.IResponse> => {
  const url = 'index.php';
  const params = {
    platform_flag_label: PlatformFlagLabel.Web,
    area_id: 1,
    ...query
  };
  const headers = getHeaders(query);
  const config = { params, headers };
  debug('fetching', url, query);
  const { data } = await ott.get<Index.IResponse>(url, config);
  return data;
};

/**
 * Get the request headers
 *
 * @private
 * @param {Index.IQuery} query
 * @returns The request headers
 */
function getHeaders (query: Index.IQuery) {
  const { product_id: productId } = query;
  return {
    Referer: `https://www.viu.com/ott/hk/zh-hk/vod/${productId ? productId + '/' : ''}`
  };
}

export default ott;
