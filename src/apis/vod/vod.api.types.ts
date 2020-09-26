import { Index, PlatformFlagLabel } from '../ott/ott.api.types';
import { LanguageFlag, SubtitleLanguageCode } from '../../types/viu.types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AjaxDetail {
  export interface IQuery extends Index.IQuery {
    r?: string;
    platform_flag_label?: PlatformFlagLabel;
    area_id?: string | number;
    language_flag_id?: LanguageFlag;
    ut?: string | number;
  }
  
  export interface IResponse extends Index.IResponse {
    data: IData;
  }
  
  interface IData {
    current_product?: ICurrentProduct;
    series?: ISeries;
    series_prediction_actor?: unknown;
    series_prediction_category?: ISeriesPredictionCategory[];
    series_prediction?: ISeriesPredictionCategory[];
    movie_prediction_actor?: unknown;
    movie_prediction_category?: unknown;
    movie_prediction?: unknown;
    is_follow: number;
  }
  
  interface ISeriesPredictionCategory {
    series_id: string;
    series_name: string;
    series_description: string;
    series_cover_image_url: string;
    product_id: string;
    product_number: string;
    product_free_time: number;
    is_movie: number;
    series_image_url: string;
    product_image_url: string;
    series_category_name: string;
    series_category_id: string;
    is_parental_lock_limited: string;
  }
  
  interface ISeries {
    name: string;
    description: string;
    product_total: string;
    category_name: string;
    category_id: string;
    release_time: string;
    schedule_start_time: string;
    schedule_end_time: string;
    cover_image_url: string;
    update_cycle_description: string;
    cp_logo_url?: unknown;
    series_language?: unknown;
    allow_chromecast_play_big_screen: string;
    allow_airplay_play_big_screen: string;
    is_watermark: string;
    product: IProduct[];
    actor?: unknown;
    tag: ITag[];
    series_tag: ISeriesTag[];
  }
  
  interface ISeriesTag {
    id: number;
    type: string;
    tags: ITag2[];
  }
  
  interface ITag2 {
    tag_id: string;
    name: string;
  }
  
  interface ITag {
    id: string;
    name: string;
    type: string;
  }
  
  interface IProduct {
    product_id: string;
    number: string;
    synopsis: string;
    description: string;
    schedule_start_time: string;
    schedule_end_time: string;
    free_time: string;
    cover_image_url: string;
    series_category_name: string;
    is_parental_lock_limited: string;
    allow_download: number;
  }
  
  interface ICurrentProduct {
    series_id: string;
    product_id: string;
    number: string;
    synopsis: string;
    description: string;
    schedule_start_time: string;
    schedule_end_time: string;
    free_time: string;
    cover_image_url: string;
    ccs_product_id: string;
    allow_download: string;
    share_url: string;
    subtitle: (ISubtitle | undefined)[];
    focus?: unknown;
    ad: IAd[];
    is_movie: number;
    is_parental_lock_limited: string;
    allow_play_big_screen: string;
    play_big_screen_start_time: string;
    play_big_screen_end_time: string;
    allow_chromecast_play_big_screen: number;
    allow_airplay_play_big_screen: number;
    product_tag: unknown[];
  }
  
  interface IAd {
    position: number;
    code_list: ICodelist[];
    start_time: string;
  }
  
  interface ICodelist {
    ad_stuff: string;
    ad_track?: unknown;
    ad_is_user_pay: string;
    ima_force: number;
  }
  
  interface ISubtitle {
    name: keyof typeof SubtitleLanguageCode;
    url: string;
    is_default: number;
    product_subtitle_id: string;
    product_subtitle_language_id: LanguageFlag;
  }
}

