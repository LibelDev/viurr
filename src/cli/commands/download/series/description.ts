import * as inspect from '../../../../lib/inspect';
import * as description from '../episode/description';

export const command = 'description <productId> <filePathTemplate>';

export const describe = 'Download descriptions of a series';

export const handler = async (argv: description.Options) => {
  const {productId} = argv;
  const series = await inspect.series(productId);
  const {episodes} = series;
  for (const {productId} of episodes) {
    const _argv = {...argv, productId} as description.Options;
    await description.handler(_argv);
  }
};
