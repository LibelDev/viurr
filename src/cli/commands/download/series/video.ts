import * as inspect from '../../../../lib/inspect';
import * as video from '../episode/video';

const {builder} = video;

export const command = 'video <productId> <filePathTemplate>';

export const describe = 'Download videos of a series';

export {builder};

export const handler = async (argv: video.Options) => {
  const {productId} = argv;
  const series = await inspect.series(productId);
  const {episodes} = series;
  for (const {productId} of episodes) {
    const _argv = {...argv, productId} as video.Options;
    await video.handler(_argv);
  }
};
