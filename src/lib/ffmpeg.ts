import { spawn } from 'child_process';
import debugFactory from 'debug';
import config from '../config/config';

const debug = debugFactory('viurr:lib:ffmpeg');

const { ffmpeg } = config.executables;

/**
 * Encode with FFmpeg, throws process exit signal on error
 * 
 * @async
 * @param {string[]} args arguments being passed to FFmpeg
 */
export const encode = (args: string[]): Promise<void> => {
  debug('args:', args);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const process = spawn(ffmpeg, args);

    process.stdout.on('data', (data) => {
      debug('stdout', data.toString());
    });

    process.stderr.on('data', (data) => {
      debug('stderr', data.toString());
    });

    process.on('close', (code, signal) => {
      debug('child process exited with code: %s, signal: %s', code, signal);
      switch (code) {
        case 0: {
          resolve();
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
