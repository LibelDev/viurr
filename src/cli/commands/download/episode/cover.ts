import * as download from '../../../../download';
import { getEpisodeInfoString } from '../../../../helpers/cli';
import type { ICommandArguments } from '../builder';

export type Options = ICommandArguments;

export const command = 'cover <productId>';

export const describe = 'Download cover image of an episode';

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId } = argv;
  const [, episode, filepath] = await download.cover(productId);
  const episodeInfoString = getEpisodeInfoString(episode);
  console.info(`Downloading cover image of ${episodeInfoString}`);
  console.info(`Downloaded: ${filepath}`);
};
