import * as subtitle from '../episode/subtitle';
import * as inspect from '../../../../inspect';

const { builder } = subtitle;

export const command = 'subtitle <productId> [filepath]';

export const describe = 'Download subtitles of a series';

export { builder };

export const handler = async (argv: subtitle.IOptions): Promise<void> => {
  const { productId } = argv;
  const series = await inspect.series(productId);
  const { episodes } = series;
  for (const episode of episodes) {
    const { productId } = episode;
    const _argv = { ...argv, productId } as subtitle.IOptions;
    await subtitle.handler(_argv);
  }
};
