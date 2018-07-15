import * as download from '../../../../lib/download';
import {CommandArguments} from '../builder';

export {CommandArguments as Options};

export const command = 'cover <productId> <filePathTemplate>';

export const describe = 'Download cover image of an episode';

export const handler = async (argv: CommandArguments) => {
  const {productId, filePathTemplate} = argv;
  console.info(`Downloading cover image of "${productId}"`);
  const filePath = await download.cover(productId, filePathTemplate);
  console.info(`Finished : ${filePath}`);
};
