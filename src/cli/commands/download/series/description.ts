import * as description from '../episode/description';
import * as inspect from '../../../../inspect';

export const command = 'description <productId> [filepath]';

export const describe = 'Download descriptions of a series';

export const handler = async (argv: description.Options): Promise<void> => {
  const { productId } = argv;
  const series = await inspect.series(productId);
  const { episodes } = series;
  for (const episode of episodes) {
    const { productId } = episode;
    const _argv = { ...argv, productId } as description.Options;
    await description.handler(_argv);
  }
};
