import debugFactory from 'debug';
import * as ott from '../ott';
import {Query, Response} from './AjaxDetails.typings';

const debug = debugFactory('viuer:api:vod:ajaxDetail');

/**
 * Request VOD AJAX Detail
 *
 * @public
 * @param {Query} query
 * @returns {Promise<Response>}
 */
export default (query: Query): Promise<Response> => {
  const _query = getQuery(query);
  return ott.getIndex(_query);
};

/**
 * Get the query object with default query options
 *
 * @private
 * @param {Query} query The query object
 * @returns {Query}
 */
function getQuery (query: Query): Query {
  const defaults = {
    r: 'vod/ajax-detail',
    ut: 1
  };
  return {
    ...defaults,
    ...query
  };
}
