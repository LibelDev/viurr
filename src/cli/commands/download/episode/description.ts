import * as download from '../../../../lib/download';
import {CommandArguments} from '../builder';

export {CommandArguments as Options};

export const command = 'description <productId> <filePathTemplate>';

export const describe = 'Download description of an episode';

export const handler = async (argv: CommandArguments) => {
  const {productId, filePathTemplate} = argv;
  console.info(`Downloading description of "${productId}"`);
  const filePath = await download.description(productId, filePathTemplate);
  console.info(`Finished : ${filePath}`);
};
