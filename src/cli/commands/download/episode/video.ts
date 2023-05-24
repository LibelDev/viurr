import type { Argv } from 'yargs';
import * as download from '../../../../download';
import { getEpisodeInfoString, trackEncoderProgress } from '../../../../helpers/cli';
import { Quality, QualityOption } from '../../../../types/types';
import type { ICommandArguments } from '../builder';

export interface IOptions extends ICommandArguments {
  quality: QualityOption;
}

export const command = 'video <productId>';

export const describe = 'Download video of an episode';

export const builder = (yargs: Argv): Argv => (
  yargs
    .option('quality', {
      string: true,
      choices: Object.keys(Quality),
      default: '1080p',
      description: 'Video quality'
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, quality } = argv;
  const [, episode, filepath, encoder] = await download.video(productId, quality);
  const episodeInfoString = getEpisodeInfoString(episode);
  console.info(`Downloading video of ${episodeInfoString} (Quality: ${quality})`);
  await trackEncoderProgress(encoder);
  console.info('Downloaded:', filepath);
};
