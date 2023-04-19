import * as inspect from '../../../../inspect';
import * as video from '../episode/video';

const { builder } = video;

export const command = 'video <productId>';

export const describe = 'Download videos of a series';

export { builder };

export const handler = async (argv: video.IOptions): Promise<void> => {
  const { productId } = argv;
  const series = await inspect.series(productId);
  const { episodes } = series;
  for (const episode of episodes) {
    const { productId } = episode;
    const _argv = { ...argv, productId } as video.IOptions;
    await video.handler(_argv);
  }
};
