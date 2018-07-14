import Debugger from 'debug';
import ffmpeg from 'fluent-ffmpeg';

const debug = Debugger('viuer:lib:ffmpeg');

export const encode = (url: string, filePath: string) => {
  const command = ffmpeg(url)
    .videoCodec('copy')
    .audioCodec('copy')
    .save(filePath);
  command.on('start', () => {
    debug('start encoding', filePath);
  });
  command.on('end', () => {
    debug('finished :', filePath);
  });
  return new Promise((resolve, reject) => {
    command.on('end', () => resolve());
    command.on('error', reject);
  });
};
