import debugFactory from 'debug';

const debug = debugFactory('viurr:config');

const { FFMPEG_PATH, FFPROBE_PATH } = process.env;

const config = {
  executables: {
    ffmpeg: FFMPEG_PATH,
    ffprobe: FFPROBE_PATH
  }
};

debug(config);

export default config;
