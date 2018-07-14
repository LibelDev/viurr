import * as OTT from '../ott.typings';

export interface Query extends OTT.Query {
  r?: string;
  platform_flag_label?: OTT.PlatformFlagLabel;
  area_id?: string | number;
  product_id: string | number;
  ut?: string | number;
}

export interface Response extends OTT.Response {
  data: Data;
}

interface Data {
  current_product: CurrentProduct;
  series: Series;
  series_prediction_actor?: any;
  series_prediction_category: SeriesPredictionCategory[];
  series_prediction: SeriesPredictionCategory[];
  movie_prediction_actor?: any;
  movie_prediction_category?: any;
  movie_prediction?: any;
  is_follow: number;
}

interface SeriesPredictionCategory {
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

interface Series {
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
  cp_logo_url?: any;
  series_language?: any;
  allow_chromecast_play_big_screen: string;
  allow_airplay_play_big_screen: string;
  is_watermark: string;
  product: Product[];
  actor?: any;
  tag: Tag[];
  series_tag: SeriesTag[];
}

interface SeriesTag {
  id: number;
  type: string;
  tags: Tag2[];
}

interface Tag2 {
  tag_id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  type: string;
}

interface Product {
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

interface CurrentProduct {
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
  subtitle: Subtitle[];
  focus?: any;
  ad: Ad[];
  is_movie: number;
  is_parental_lock_limited: string;
  allow_play_big_screen: string;
  play_big_screen_start_time: string;
  play_big_screen_end_time: string;
  allow_chromecast_play_big_screen: number;
  allow_airplay_play_big_screen: number;
  product_tag: any[];
}

interface Ad {
  position: number;
  code_list: Codelist[];
  start_time: string;
}

interface Codelist {
  ad_stuff: string;
  ad_track?: any;
  ad_is_user_pay: string;
  ima_force: number;
}

interface Subtitle {
  name: string;
  url: string;
  is_default: number;
  product_subtitle_id: string;
  product_subtitle_language_id: string;
}
