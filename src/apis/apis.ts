import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import debugFactory from 'debug';
import config from '../config/config';
import { parseHTML } from '../helpers/dom';
import { LanguageFlagId, Platform, PlatformFlagLabel } from '../types/types';
import { getValueBySimilarKey } from '../helpers/object';
import type { AuthTokenAPI, IProductPageProps, MobileAPI, PlaybackDistributeAPI } from './apis.types';

const debug = debugFactory('viurr:apis');

const api = axios.create({
  baseURL: config.apiBaseURL,
  headers: {
    'Origin': 'https://www.viu.com',
    'Accept-Encoding': 'gzip, deflate, br'
  },
  adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter!))
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRequestHeaders (query: any) {
  if ('product_id' in query) {
    const { product_id } = query;
    return {
      Referer: `https://www.viu.com/ott/hk/zh/vod/${product_id ? product_id + '/' : ''}`
    };
  }
  return {
    Referer: 'https://www.viu.com/'
  };
}

export const fetchProductPageProps = async (productId: string | number): Promise<IProductPageProps> => {
  const url = `${config.publicURL}/ott/hk/zh/vod/${productId}`;
  debug('fetchProductPageProps: fetching', url);
  const { data } = await api.get<string>(url);
  const { document } = parseHTML(data);
  const script = document.querySelector('#__NEXT_DATA__');
  const json = script?.innerHTML || '{}';
  const { props: { pageProps: { initialProps: { fallback } } } } = JSON.parse(json);
  const productAltLangList = getValueBySimilarKey<IProductPageProps, 'productAltLangList'>(fallback, 'PRODUCT_ALT_LANG_LIST')!;
  const productDetail = getValueBySimilarKey<IProductPageProps, 'productDetail'>(fallback, 'PRODUCT_DETAIL')!;
  debug('fetchProductPageProps: fetched', { productAltLangList, productDetail });
  return { productAltLangList, productDetail };
};

export async function fetchAuthToken (query?: AuthTokenAPI.IQuery, payload?: AuthTokenAPI.IRequestPayload): Promise<AuthTokenAPI.IResponse> {
  const url = '/api/auth/token';
  const params: AuthTokenAPI.IQuery = {
    platform_flag_label: PlatformFlagLabel.Web,
    area_id: 1,
    language_flag_id: LanguageFlagId.TraditionalChinese,
    platformFlagLabel: PlatformFlagLabel.Web,
    areaId: 1,
    languageFlagId: LanguageFlagId.TraditionalChinese,
    countryCode: 'HK',
    ...query
  };
  const body: AuthTokenAPI.IRequestPayload = {
    appVersion: '3.0.10',
    carrierId: '0',
    countryCode: 'HK',
    language: LanguageFlagId.TraditionalChinese,
    platform: Platform.Browser,
    platformFlagLabel: PlatformFlagLabel.Web,
    uuid: config.uuid,
    ...payload
  };
  const headers = getRequestHeaders(params);
  debug('fetchAuthToken: fetching', url, params, body);
  const { data } = await api.post<AuthTokenAPI.IResponse>(url, body, { params, headers });
  debug('fetchAuthToken: fetched', data);
  return data;
}

export async function fetchMobile (query: MobileAPI.IVodDetailQuery, headers?: Record<string, string>): Promise<MobileAPI.IVodDetailResponse>;
export async function fetchMobile (query: MobileAPI.IVodProductListQuery, headers?: Record<string, string>): Promise<MobileAPI.IVodProductListResponse>;
export async function fetchMobile<Q extends MobileAPI.IQuery> (query: Q, headers?: Record<string, string>): Promise<MobileAPI.IVodDetailResponse | MobileAPI.IVodProductListResponse> {
  const url = '/api/mobile';
  const params: MobileAPI.IQuery = {
    platform_flag_label: PlatformFlagLabel.Web,
    platformFlagLabel: PlatformFlagLabel.Web,
    area_id: 1,
    areaId: 1,
    language_flag_id: LanguageFlagId.TraditionalChinese,
    languageFlagId: LanguageFlagId.TraditionalChinese,
    countryCode: 'HK',
    os_flag_id: 1,
    ...query
  };
  const _headers = {
    ...getRequestHeaders(params),
    ...headers
  };
  debug('fetchMobile: fetching', url, params);
  const { data } = await api.get<MobileAPI.IVodDetailResponse | MobileAPI.IVodProductListResponse>(url, { params, headers: _headers });
  debug('fetchMobile: fetched', data);
  return data;
}

export async function fetchPlaybackDistribute (query: PlaybackDistributeAPI.IQuery, headers?: Record<string, string>): Promise<PlaybackDistributeAPI.IResponse> {
  const url = '/api/playback/distribute';
  const params: PlaybackDistributeAPI.IQuery = {
    platform_flag_label: PlatformFlagLabel.Web,
    area_id: 1,
    language_flag_id: LanguageFlagId.TraditionalChinese,
    platformFlagLabel: PlatformFlagLabel.Web,
    areaId: 1,
    languageFlagId: LanguageFlagId.TraditionalChinese,
    countryCode: 'HK',
    ut: 1,
    ...query
  };
  const _headers = {
    ...getRequestHeaders(params),
    ...headers
  };
  debug('fetchPlaybackDistribute: fetching', url, params);
  const { data } = await api.get<PlaybackDistributeAPI.IResponse>(url, { params, headers: _headers });
  debug('fetchPlaybackDistribute: fetched', data);
  return data;
}
