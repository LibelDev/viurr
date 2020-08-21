import debugFactory from 'debug';
import os from 'os';
import path from 'path';

const debug = debugFactory('viurr:config');

const { FFMPEG_PATH, FFPROBE_PATH } = process.env;

enum Type {
  'Darwin' = 'darwin',
  'Linux' = 'linux',
  'Windows_NT' = 'windows'
}

enum Architecture {
  'x32' = 'x86',
  'x64' = 'x64'
}

const architecture = os.arch() as keyof typeof Architecture;
const type = os.type() as keyof typeof Type;

const isWindows = type === 'Windows_NT';

const ffmpegVersion = '4.3.1';
const ffmpegDirectory = path.join(__dirname, '../../bin/ffmpeg', ffmpegVersion, Type[type], Architecture[architecture]);

const config = {
  executables: {
    ffmpeg: FFMPEG_PATH || path.join(ffmpegDirectory, `ffmpeg${isWindows ? '.exe' : ''}`),
    ffprobe: FFPROBE_PATH || path.join(ffmpegDirectory, `ffprobe${isWindows ? '.exe' : ''}`)
  }
};

debug(config);

export default config;
