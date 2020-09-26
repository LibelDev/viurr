import { ICommandArguments } from '../builder';
import * as download from '../../../../download';

export type Options = ICommandArguments;

export const command = 'description <productId> [filepath]';

export const describe = 'Download description of an episode';

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, filepath } = argv;
  const [series, episode, _filepath] = await download.description(productId, filepath);
  console.info(`Downloading description of "${series.title}" EP.${episode.number} "${episode.title}"`);
  console.info(`Downloaded: ${_filepath}`);
};
