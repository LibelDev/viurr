import debugFactory from 'debug';
import path from 'path';
import * as uuid from 'uuid';

const debug = debugFactory('viurr:config');

const { FFMPEG_PATH } = process.env;

const config = {
  uuid: uuid.v4(),
  publicURL: 'https://www.viu.com',
  apiBaseURL: 'https://api-gateway-global.viu.com',
  temporaryDirectory: path.resolve(__dirname, '../../.tmp'),
  executables: {
    ffmpeg: FFMPEG_PATH || 'ffmpeg'
  }
};

debug(config);

export default config;
