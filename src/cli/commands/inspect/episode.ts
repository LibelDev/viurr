import prettyjson from 'prettyjson';
import * as inspect from '../../../lib/inspect';
import builder, {Options} from './builder';

export const command = 'episode <productId>';

export const describe = 'Inspect details of an episode';

export {builder};

export const handler = async (argv: Options) => {
  const {productId, json} = argv;
  const episode = await inspect.episode(productId);
  const output = json ? JSON.stringify(episode, null, 2) : prettyjson.render(episode);
  console.info(output);
}
