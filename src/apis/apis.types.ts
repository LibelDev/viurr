/* eslint-disable @typescript-eslint/no-namespace */
import type { LanguageFlagId, Platform, PlatformFlagLabel, Quality, SecondSubtitlePosition, SubtitleLanguageName } from '../types/types';

type TResponse<D> = {
  data: D;
  status?: {
    code: number;
    message: string;
  };
  server?: {
    time: number;
    area: {
      area_id: number;
      language: {
        language_flag_id: LanguageFlagId;
        label: string;
        mark: string;
        is_default: string;
      }[];
    };
  };
};

interface ICurrentProduct {
  series_id: string;
  product_id: string;
  number: string;
  synopsis: string;
  description: string;
  schedule_start_time: string;
  schedule_end_time: string;
  skip_intro_start_time: number;
  skip_intro_end_time: number;
  free_time: number;
  premium_time: number;
  is_free_premium_time: number;
  duration_start: number;
  cover_image_url: string;
  ccs_product_id: string;
  allow_download: string;
  share_url: string;
  subtitle: {
    is_default: number;
    name: SubtitleLanguageName;
    url: string;
    subtitle_url: string;
    product_subtitle_id: string;
    product_subtitle_language_id: string;
    second_subtitle_url: string;
    second_subtitle_position: SecondSubtitlePosition;
    code: string;
  }[];
  focus: null;
  ad: {
    position: number;
    code_list: {
      ad_stuff: string;
      ad_track: null;
      ad_is_user_pay: string;
      ima_force: string;
    }[];
    start_time: string;
  }[];
  is_movie: number;
  is_parental_lock_limited: string;
  allow_play_big_screen: string;
  play_big_screen_start_time: string;
  play_big_screen_end_time: string;
  time_duration: string;
  campaign_name: string;
  user_level: number;
  seo_title: string;
  seo_description: string;
  has_content_window: string;
  classification: null;
  classification_url: null;
  content_advisory: string;
  censorship_ads_mp4_url: string;
  client_logo: null;
  keyword: string;
  offline_time: string;
  poster_logo_url: string;
  source_flag: string;
  allow_tv: string;
  allow_telstb: string;
  released_product_total: number;
  cover_landscape_image_url: string;
  cover_portrait_image_url: string;
  series_cover_landscape_image_url: string;
  series_cover_portrait_image_url: string;
  allow_chromecast_play_big_screen: number;
  allow_airplay_play_big_screen: number;
  overlay: null;
  product_tag: unknown[];
}

interface ISeries {
  series_id: string;
  name: string;
  content_advisory: string;
  allow_telstb: string;
  description: string;
  product_total: string;
  category_name: string;
  category_id: string;
  ott_cate: string;
  release_time: string;
  schedule_start_time: string;
  schedule_end_time: string;
  cover_image_url: string;
  cover_landscape_image_url: string;
  cover_portrait_image_url: string;
  update_cycle_description: string;
  cp_logo_url: null;
  cp_name: string;
  series_language: null;
  allow_chromecast_play_big_screen: string;
  allow_airplay_play_big_screen: string;
  is_watermark: string;
  watermark_position: number;
  watermark_url: string;
  allow_tv: string;
  seo_title: string;
  seo_description: string;
  release_of_year: string;
  actor: null;
  series_tag: {
    id: number;
    type: string;
    tags: {
      id?: string;
      tag_id: string;
      name: string;
      type?: string;
    }[];
  }[];
}

export interface IProductPageProps {
  productAltLangList: TResponse<{
    product: {
      area_id: string;
      language_flag_id: LanguageFlagId;
      series_id: string;
      series_name: string;
      product_id: string;
      is_produced: string;
      status: number;
      is_deleted: string;
      ccs_product_id: string;
      is_movie: number;
      app: {
        param: string;
      };
      country_ids: string;
      allow_telstb: string;
    }[];
  }>;
  productDetail: TResponse<{
    current_product: ICurrentProduct;
    series: ISeries;
  }>;
}

export namespace AuthTokenAPI {
  export interface IQuery {
    platform_flag_label?: PlatformFlagLabel;
    area_id?: string | number;
    language_flag_id?: LanguageFlagId;
    platformFlagLabel?: PlatformFlagLabel;
    areaId?: string | number;
    languageFlagId?: LanguageFlagId;
    countryCode?: string;
  }

  export interface IRequestPayload {
    appVersion?: string;
    carrierId?: string;
    countryCode?: string;
    language?: LanguageFlagId;
    platform?: Platform;
    platformFlagLabel?: PlatformFlagLabel;
    uuid?: string;
  }

  export interface IResponse {
    status: number;
    token: string;
  }
}

export namespace MobileAPI {
  export interface IQuery {
    platform_flag_label?: PlatformFlagLabel;
    area_id?: string | number;
    language_flag_id?: LanguageFlagId;
    platformFlagLabel?: PlatformFlagLabel;
    areaId?: string | number;
    languageFlagId?: LanguageFlagId;
    countryCode?: string;
    ut?: string | number;
    os_flag_id?: number;
  }

  export interface IVodDetailQuery extends IQuery {
    r?: '/vod/detail',
    ut: number,
    product_id?: string | number;
  }

  export interface IVodProductListQuery extends IQuery {
    r?: '/vod/product-list',
    series_id?: string | number;
    size?: number;
    sort?: 'asc' | 'desc';
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IVodDetailResponse extends TResponse<IVodDetailData> {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IVodProductListResponse extends TResponse<IVodProductListData> {
  }

  interface IVodDetailData {
    current_product?: ICurrentProduct;
    series?: ISeries;
  }

  interface IVodProductListData {
    product_list: {
      product_id: string;
      number: string;
      synopsis: string;
      schedule_start_time: string;
      schedule_end_time: string;
      cover_image_url: string;
      series_category_name: string;
      is_parental_lock_limited: string;
      description: string;
      allow_download: number;
      offline_time: string;
      free_time: number;
      premium_time: number;
      is_free_premium_time: number;
      user_level: number;
      poster_logo_url: string;
      source_flag: string;
      allow_tv: string;
      is_movie: number;
      allow_telstb: string;
      released_product_total: number;
      cover_landscape_image_url: string;
      cover_portrait_image_url: string;
      series_cover_landscape_image_url: string;
      series_cover_portrait_image_url: string;
      time_duration: string;
      ccs_product_id: string;
    }[];
  }
}

export namespace PlaybackDistributeAPI {
  export interface IQuery {
    platform_flag_label?: PlatformFlagLabel;
    area_id?: string | number;
    language_flag_id?: LanguageFlagId;
    platformFlagLabel?: PlatformFlagLabel;
    areaId?: string | number;
    languageFlagId?: LanguageFlagId;
    countryCode?: string;
    ut?: string | number;
    ccs_product_id?: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface IResponse extends TResponse<IData> {
  }

  interface IData {
    stream: {
      url: TURL;
      airplayurl: TURL;
      airplayurl2: TURL;
      url3: TURL;
      airplayurl3: TURL;
      sizeurl: TURL;
      duration: number;
      cdn: string;
      cdn2: string;
      cdn3: string;
      region: string;
      ispName: string;
      ratio: string;
      size: TSize;
      duration_start: number;
    };
  }

  type TSize = Record<Quality, number>;

  export type TURL = Record<Quality, string>;
}
