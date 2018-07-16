import debugFactory from 'debug';
import ffmpeg from 'fluent-ffmpeg';
import exists from './exists';

const debug = debugFactory('viurr:lib:ffmpeg');

export const encode = (url: string, filePath: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (await exists(filePath)) {
      const err = new Error(`${filePath} already exists`);
      return reject(err);
    }
    const command = ffmpeg(url)
      .videoCodec('copy')
      .audioCodec('copy')
      .save(filePath);
    command.on('start', (commandLine) => {
      debug('start encoding', filePath);
      debug('command :', commandLine);
    });
    command.on('end', () => {
      debug('finished :', filePath);
    });
    command.on('end', () => resolve());
    command.on('error', reject);
  });
};
