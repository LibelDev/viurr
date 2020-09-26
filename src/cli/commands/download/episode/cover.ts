import { ICommandArguments } from '../builder';
import * as download from '../../../../download';

export type Options = ICommandArguments;

export const command = 'cover <productId> [filepath]';

export const describe = 'Download cover image of an episode';

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, filepath } = argv;
  const [series, episode, _filepath] = await download.cover(productId, filepath);
  console.info(`Downloading cover image of "${series.title}" EP.${episode.number} "${episode.title}"`);
  console.info(`Downloaded: ${_filepath}`);
};
