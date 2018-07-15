export type Query = any;

export interface Response {
  data: any;
  status?: Status;
  server?: Server;
}

export interface Server {
  time: number;
  area: Area;
}

interface Area {
  area_id: number;
  language: Language[];
}

interface Language {
  language_flag_id: string;
  label: string;
  mark: string;
  is_default: string;
}

export interface Status {
  code: number;
  message: string;
}
