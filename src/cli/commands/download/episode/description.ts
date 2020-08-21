import * as download from '../../../../download';
import { ICommandArguments } from '../builder';

export type Options = ICommandArguments;

export const command = 'description <productId> <filepath>';

export const describe = 'Download description of an episode';

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, filepath } = argv;
  console.info(`Downloading description of "${productId}"`);
  const _filepath = await download.description(productId, filepath);
  console.info(`Finished: ${_filepath}`);
};
