import debugFactory from 'debug';

const debug = debugFactory('viurr:config');

const { FFMPEG_PATH, FFPROBE_PATH } = process.env;

const config = {
  executables: {
    ffmpeg: FFMPEG_PATH || 'ffmpeg',
    ffprobe: FFPROBE_PATH || 'ffprobe'
  }
};

debug(config);

export default config;
