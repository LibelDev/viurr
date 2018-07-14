export interface Query {
  ccs_product_id: string;
}

export interface Response {
  data: Data;
  status: Status;
  server: Server;
}

interface Data {
  stream: Stream;
}

interface Stream {
  url: URL;
  size: Size;
  duration: number;
}

interface Size {
  s240p: number;
  s480p: number;
  s720p: number;
  s1080p: number;
}

interface URL {
  s240p: string;
  s480p: string;
  s720p: string;
  s1080p: string;
}

interface Server {
  time: number;
}

interface Status {
  code: number;
  message: string;
}
