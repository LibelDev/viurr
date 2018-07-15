import prettyjson from 'prettyjson';
import * as inspect from '../../../lib/inspect';
import builder, {Options} from './builder';

export const command = 'series <productId>';

export const describe = 'Inspect details of a series';

export {builder};

export const handler = async (argv: Options) => {
  const {productId, json} = argv;
  const series = await inspect.series(productId);
  const output = json ? JSON.stringify(series, null, 2) : prettyjson.render(series);
  console.info(output);
}
