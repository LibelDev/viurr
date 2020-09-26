import ProgressBar from 'progress';
import { Argv } from 'yargs';
import { ICommandArguments } from '../builder';
import * as download from '../../../../download';
import { Quality, QualityOption } from '../../../../types/viu.types';

export interface IOptions extends ICommandArguments {
  quality: QualityOption;
}

export const command = 'video <productId> [filepath]';

export const describe = 'Download video of an episode';

export const builder = (yargs: Argv): Argv => (
  yargs
    .option('quality', {
      string: true,
      choices: Object.keys(Quality),
      default: '1080p',
      description: 'Video quality'
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, filepath, quality } = argv;
  const [series, episode, _filepath, encoder] = await download.video(productId, filepath, quality);
  console.info(`Downloading video of "${series.title}" EP.${episode.number} "${episode.title}" (Quality: ${quality})`);
  return new Promise((resolve, reject) => {
    const progress = new ProgressBar('Encoding [:fps/fps] [:bitRate] [:size] [:outTime]', { total: 1, clear: true });
    encoder.on('status', (status) => {
      progress.update(0, status);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    encoder.on('error', () => { });
    encoder.on('end', (code, signal) => {
      switch (code) {
        case 0: {
          progress.update(1);
          console.info('Downloaded:', _filepath);
          resolve();
          break;
        }
        default: {
          const err = new Error(`Unexpected error occurred, encoder process exited with code: ${code}, signal: ${signal}`);
          reject(err);
        }
      }
    });
  });
};
