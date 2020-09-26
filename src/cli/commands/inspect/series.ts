import prettyjson from 'prettyjson';
import builder, { ICommandArguments } from './builder';
import * as inspect from '../../../inspect';

export const command = 'series <productId>';

export const describe = 'Inspect details of a series';

export { builder };

export const handler = async (argv: ICommandArguments): Promise<void> => {
  const { productId, json } = argv;
  const series = await inspect.series(productId);
  const output = json ? JSON.stringify(series, null, 2) : prettyjson.render(series);
  console.info(output);
};
