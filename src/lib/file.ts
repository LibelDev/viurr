import fs from 'fs';
import type { IEpisode } from '../types/viu.types';

const { access } = fs.promises;

/**
 * Check whether the given filepath exists
 */
export const exists = async (filepath: string): Promise<boolean> => {
  try {
    await access(filepath);
    return true;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = error;
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};

export const getBaseFilename = (episode: IEpisode): string => {
  return `${episode.seriesTitle} EP.${episode.number} 【${episode.title}】`;
};
