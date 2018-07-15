import * as inspect from '../../../../lib/inspect';
import * as cover from '../episode/cover';

export const command = 'cover <productId> <filePathTemplate>';

export const describe = 'Download cover images of a series';

export const handler = async (argv: cover.Options) => {
  const {productId} = argv;
  const series = await inspect.series(productId);
  const {episodes} = series;
  for (const {productId} of episodes) {
    const _argv = {...argv, productId} as cover.Options;
    await cover.handler(_argv);
  }
};
