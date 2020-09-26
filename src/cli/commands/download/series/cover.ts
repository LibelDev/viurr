import * as cover from '../episode/cover';
import * as inspect from '../../../../inspect';

export const command = 'cover <productId> [filepath]';

export const describe = 'Download cover images of a series';

export const handler = async (argv: cover.Options): Promise<void> => {
  const { productId } = argv;
  const series = await inspect.series(productId);
  const { episodes } = series;
  for (const episode of episodes) {
    const { productId } = episode;
    const _argv = { ...argv, productId } as cover.Options;
    await cover.handler(_argv);
  }
};
