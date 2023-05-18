import { spawn } from 'child_process';
import debugFactory from 'debug';
import EventEmitter from 'events';
import filesize from 'filesize';
import config from '../config/config';
import { Quality, SubtitleLanguageCode, type IEpisode, type ISubtitle, type QualityOption } from '../types/types';
import { fetchImageWithMetadata } from './image';

const debug = debugFactory('viurr:lib:ffmpeg');

const { ffmpeg } = config.executables;

export interface ISavedSubtitle extends ISubtitle {
  filepath: string;
}

interface IRawProgressStatusRegexMap {
  [key: string]: RegExp;
}

interface IProgressStatus {
  [key: string]: string;
}

export interface IEncoder extends EventEmitter {
  emit (event: 'status', status: IProgressStatus): boolean;
  emit (event: 'error', error: string): boolean;
  emit (event: 'end', code: number, signal: NodeJS.Signals): boolean;
  on (event: 'status', listener: (status: IProgressStatus) => void): this;
  on (event: 'error', listener: (error: string) => void): this;
  on (event: 'end', listener: (code: number, signal: NodeJS.Signals) => void): this;
}

class Encoder extends EventEmitter implements IEncoder { }

/**
 * Encode with FFmpeg
 */
export const encode = async (episode: IEpisode, quality: QualityOption, subtitles: ISavedSubtitle[], filepath: string) => {
  if (!ffmpeg) {
    throw new Error('ENV `FFMPEG_PATH` is not defined');
  }
  const args = await createArguments(episode, quality, subtitles, filepath);
  debug('args:', args);
  const encoder = new Encoder();
  const process = spawn(ffmpeg, args);
  process.stdout.on('data', (chunk) => {
    const output = chunk.toString();
    debug('stdout', output);
    const status = normalizeProgressStatus(output);
    encoder.emit('status', status);
  });
  process.stderr.on('data', (chunk) => {
    const output = chunk.toString();
    debug('stderr', output);
    encoder.emit('error', output);
  });
  process.on('close', (code, signal) => {
    debug('child process exited with code: %s, signal: %s', code, signal);
    encoder.emit('end', code, signal);
  });
  return encoder;
};

// Helper functions
const createArguments = async (episode: IEpisode, quality: QualityOption, subtitles: ISavedSubtitle[], filepath: string) => {
  const _quality = Quality[quality];
  const url = episode.urls[_quality];
  const [, mimeType, extension] = await fetchImageWithMetadata(episode.coverImageURL);
  const args = [
    '-i', url,
    ...subtitles.flatMap((subtitle) => ['-i', subtitle.filepath]),
    '-attach', episode.coverImageURL,
    '-metadata', `title=${episode.title}`,
    '-metadata', `description=${episode.description}`,
    '-metadata:s:t:0', `mimetype=${mimeType}`,
    '-metadata:s:t:0', `filename=cover.${extension}`
  ];
  for (let i = 0; i < subtitles.length; i++) {
    const subtitle = subtitles[i];
    const start = args.length - 4;
    args.splice(
      start, 0,
      `-metadata:s:s:${i}`, `title=${subtitle.name}`,
      `-metadata:s:s:${i}`, `language=${SubtitleLanguageCode[subtitle.name] || SubtitleLanguageCode.Undefined}`
    );
  }
  args.push('-f', 'matroska');
  args.push('-c', 'copy');
  args.push('-progress', '-', '-nostats');
  args.push(filepath);
  return args;
};

const normalizeProgressStatus = (output: string) => {
  const regexes: IRawProgressStatusRegexMap = {
    frame: /frame=(.*)/,
    fps: /fps=(.*)/,
    bitRate: /bitrate=(.*)/,
    size: /total_size=(.*)/,
    outTime: /out_time=(.*)/,
    speed: /speed=(.*)/,
    progress: /progress=(.*)/
  };
  const progressStatus: IProgressStatus = {};
  for (const key in regexes) {
    const regex = regexes[key];
    const matched = output.match(regex);
    if (matched && matched[1]) {
      const value = matched[1].trim();
      switch (key) {
        case 'bitRate': {
          const _value = value.replace(/kbits\/s/, ' Kb/s');
          progressStatus[key] = _value;
          break;
        }
        case 'size': {
          const size = parseInt(value);
          progressStatus[key] = filesize(size);
          break;
        }
        case 'outTime': {
          const _value = value.split('.')[0];
          progressStatus[key] = _value;
          break;
        }
        default: {
          progressStatus[key] = value;
        }
      }
    }
  }
  return progressStatus;
};
