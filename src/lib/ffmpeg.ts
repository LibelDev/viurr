import { spawn } from 'child_process';
import debugFactory from 'debug';
import EventEmitter from 'events';
import filesize from 'filesize';
import config from '../config/config';

const debug = debugFactory('viurr:lib:ffmpeg');

const { ffmpeg } = config.executables;

interface IRawProgressStatusRegexMap {
  [key: string]: RegExp;
}

export interface IProgressStatus {
  [key: string]: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare interface Encoder {
  emit (event: 'status', status: IProgressStatus): boolean;
  emit (event: 'error', error: string): boolean;
  emit (event: 'end', code: number, signal: NodeJS.Signals): boolean;
  on (event: 'status', listener: (status: IProgressStatus) => void): this;
  on (event: 'error', listener: (error: string) => void): this;
  on (event: 'end', listener: (code: number, signal: NodeJS.Signals) => void): this;
}

class Encoder extends EventEmitter { }

/**
 * Encode with FFmpeg
 * 
 * @param {string[]} args arguments being passed to FFmpeg
 * @param {string} filepath output file
 * @returns {Encoder}
 */
export const encode = (args: string[], filepath: string): Encoder => {
  if (!ffmpeg) {
    throw new Error('ENV `FFMPEG_PATH` is not defined');
  }

  const _args = args.slice();
  _args.push('-progress', '-', '-nostats');
  _args.push(filepath);

  debug('args:', _args);

  const encoder = new Encoder();

  // eslint-disable-next-line no-async-promise-executor
  const process = spawn(ffmpeg, _args);

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
function normalizeProgressStatus (output: string): IProgressStatus {
  const regexes = {
    frame: /frame=(.*)/,
    fps: /fps=(.*)/,
    bitRate: /bitrate=(.*)/,
    size: /total_size=(.*)/,
    outTime: /out_time=(.*)/,
    speed: /speed=(.*)/,
    progress: /progress=(.*)/
  } as IRawProgressStatusRegexMap;
  const status = {} as IProgressStatus;
  for (const key in regexes) {
    const regex = regexes[key];
    const matched = output.match(regex);
    if (matched && matched[1]) {
      const value = matched[1].trim();
      switch (key) {
        case 'bitRate': {
          const _value = value.replace(/kbits\/s/, ' Kb/s');
          status[key] = _value;
          break;
        }
        case 'size': {
          const size = parseInt(value);
          status[key] = filesize(size);
          break;
        }
        case 'outTime': {
          const _value = value.split('.')[0];
          status[key] = _value;
          break;
        }
        default: {
          status[key] = value;
        }
      }
    }
  }
  return status;
}
