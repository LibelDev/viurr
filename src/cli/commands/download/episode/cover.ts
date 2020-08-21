import * as download from '../../../../download';
import { ICommandArguments } from '../builder';

export type Options = ICommandArguments;

export const command = 'cover <productId> <filepath>';

export const describe = 'Download cover image of an episode';

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, filepath } = argv;
  console.info(`Downloading cover image of "${productId}"`);
  const _filepath = await download.cover(productId, filepath);
  console.info(`Finished: ${_filepath}`);
};
