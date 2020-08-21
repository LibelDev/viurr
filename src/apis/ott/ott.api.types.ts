import { LanguageFlag } from '../../types/viu.types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Index {
  export interface IQuery {
    product_id?: string | number;
  }

  export interface IResponse {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    status?: IStatus;
    server?: IServer;
  }

  interface IServer {
    time: number;
    area: IArea;
  }

  interface IArea {
    area_id: number;
    language: ILanguage[];
  }

  interface ILanguage {
    language_flag_id: LanguageFlag;
    label: string;
    mark: string;
    is_default: string;
  }

  interface IStatus {
    code: number;
    message: string;
  }
}

export enum PlatformFlagLabel {
  Web = 'web',
  Phone = 'phone'
}
