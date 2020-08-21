import prettyjson from 'prettyjson';
import * as inspect from '../../../inspect';
import builder, { ICommandArguments } from './builder';

export const command = 'episode <productId>';

export const describe = 'Inspect details of an episode';

export { builder };

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, json } = argv;
  const episode = await inspect.episode(productId);
  const output = json ? JSON.stringify(episode, null, 2) : prettyjson.render(episode);
  console.info(output);
};
