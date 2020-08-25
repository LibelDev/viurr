import ProgressBar from 'progress';
import { Argv } from 'yargs';
import * as download from '../../../../download';
import { Quality, QualityOption } from '../../../../types/viu.types';
import { ICommandArguments } from '../builder';

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
        break;
      }
      default: {
        console.error('Unexpected error occurred, encoder process exited with code: %s, signal: %s', code, signal);
        console.error('Please visit the GitHub repository [https://github.com/kitce/viurr] for more details or submit an issue to report a bug.');
      }
    }
  });
};
