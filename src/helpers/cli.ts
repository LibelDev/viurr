import ProgressBar from 'progress';
import type { IEpisode } from '../types/types';
import type { IEncoder } from './ffmpeg';
import { noop } from './noop';

export const getEpisodeInfoString = (episode: IEpisode): string => {
  return `「${episode.seriesTitle}」 EP.${episode.number} 【${episode.title}】`;
};

export const trackEncoderProgress = (encoder: IEncoder): Promise<void> => {
  return new Promise((resolve, reject) => {
    const progress = new ProgressBar('Encoding [:fps/fps] [:bitRate] [:size] [:outTime]', { total: 1, clear: true });
    encoder.on('status', (status) => { progress.update(0, status); });
    encoder.on('error', noop);
    encoder.on('end', (code, signal) => {
      switch (code) {
        case 0: {
          progress.update(1);
          resolve();
          break;
        }
        default: {
          const err = new Error(`Unexpected error occurred, encoder process exited with code: ${code}, signal: ${signal}`);
          reject(err);
        }
      }
    });
  });
};
