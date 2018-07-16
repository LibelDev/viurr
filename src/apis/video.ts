import axios, {AxiosAdapter} from 'axios';
import {cacheAdapterEnhancer, throttleAdapterEnhancer} from 'axios-extensions';
import debugFactory from 'debug';
import {apiURL} from '../constants/video';
import {Query, Response} from './video.typings';

const debug = debugFactory('viurr:api:video');

const video = axios.create({
  baseURL: apiURL,
  headers: {'Accept-Encoding': 'gzip, deflate, br'},
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter))
});

/**
 * Request Distribute Web API
 *
 * @public
 * @param {Query} query
 * @returns {Promise<Response>}
 */
export const getDistributeWeb = (query: Query): Promise<Response> => {
  const url = 'distribute_web_hk.php';
  const config = {params: query};
  debug('fetching', url, config);
  return video.get(url, config)
    .then(res => res.data);
};

export default video;
