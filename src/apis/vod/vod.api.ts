import debugFactory from 'debug';
import { AjaxDetail } from './vod.api.types';
import * as ott from '../ott/ott.api';
import { LanguageFlag } from '../../types/viu.types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = debugFactory('viurr:api:vod');

/**
 * Fetch VOD AJAX Detail data
 *
 * @async
 * @public
 * @param {AjaxDetail.IQuery} query
 * @returns {Promise<AjaxDetail.IResponse>}
 */
export const fetchAjaxDetail = async (query: AjaxDetail.IQuery): Promise<AjaxDetail.IResponse> => {
  const _query = {
    r: 'vod/ajax-detail',
    language_flag_id: LanguageFlag.TraditionalChinese,
    ut: 0,
    ...query
  };
  return ott.fetchIndex(_query);
};
