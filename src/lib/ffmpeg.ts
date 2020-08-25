import { spawn } from 'child_process';
import debugFactory from 'debug';
import config from '../config/config';

const debug = debugFactory('viurr:lib:ffmpeg');

const { ffmpeg } = config.executables;

interface IRawProgressStatusRegexMap {
  [key: string]: RegExp;
}

interface IProgressStatus {
  [key: string]: string;
}

/**
 * Encode with FFmpeg, throws process exit signal on error
 * 
 * @async
 * @param {string[]} args arguments being passed to FFmpeg
 * @returns {Promise<IProgressStatus>} final normalized progress status
 */
export const encode = (args: string[]): Promise<IProgressStatus> => {
  const _args = args.slice();
  _args.push('-progress', '-', '-nostats');
  debug('args:', _args);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const process = spawn(ffmpeg, _args);

    let status: IProgressStatus;

    process.stdout.on('data', (data) => {
      const output = data.toString();
      status = normalizeProgressStatus(output);
      debug('status', status);
    });

    // process.stderr.on('data', (data) => {
    //   debug('stderr', data.toString());
    // });

    process.on('close', (code, signal) => {
      debug('child process exited with code: %s, signal: %s', code, signal);
      switch (code) {
        case 0: {
          resolve(status);
          break;
        }
        default: {
          reject(signal);
          break;
        }
      }
    });
  });
};

// Helper functions
function normalizeProgressStatus (output: string): IProgressStatus {
  const regexes = {
    frame: /frame=(.*)/,
    fps: /fps=(.*)/,
    bitRate: /bitrate=(.*)/,
    totalSize: /total_size=(.*)/,
    outTime: /out_time=(.*)/,
    speed: /speed=(.*)/,
    progress: /progress=(.*)/
  } as IRawProgressStatusRegexMap;
  const status = {} as IProgressStatus;
  for (const key in regexes) {
    const regex = regexes[key];
    const matched = output.match(regex);
    if (matched && matched[1]) {
      const value = matched[1];
      status[key] = value.trim();
    }
  }
  return status;
}
