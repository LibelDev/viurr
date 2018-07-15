import * as inspect from '../../../../lib/inspect';
import * as subtitle from '../episode/subtitle';

const {builder} = subtitle;

export const command = 'subtitle <productId> <filePathTemplate>';

export const describe = 'Download subtitles of a series';

export {builder};

export const handler = async (argv: subtitle.Options) => {
  const {productId} = argv;
  const series = await inspect.series(productId);
  const {episodes} = series;
  for (const {productId} of episodes) {
    const _argv = {...argv, productId} as subtitle.Options;
    await subtitle.handler(_argv);
  }
};
