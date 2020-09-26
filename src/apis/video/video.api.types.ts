import { LanguageFlag } from '../../types/viu.types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DistributeWeb {
  export interface IQuery {
    ccs_product_id: string;
    language_flag_id: LanguageFlag;
  }
  
  export interface IResponse {
    data?: IData;
    status: IStatus;
    server: IServer;
  }
  
  interface IData {
    stream: IStream;
  }
  
  interface IStream {
    url: IURL;
    size: ISize;
    duration: number;
  }
  
  interface ISize {
    s240p: number;
    s480p: number;
    s720p: number;
    s1080p: number;
  }
  
  export interface IURL {
    s240p: string;
    s480p: string;
    s720p: string;
    s1080p: string;
  }
  
  interface IServer {
    time: number;
  }
  
  interface IStatus {
    code: number;
    message: string;
  }
}

