import { chain } from 'lodash';
import { Argv } from 'yargs';
import * as download from '../../../../download';
import { Quality, QualityOption } from '../../../../types/viu.types';
import { ICommandArguments } from '../builder';

export interface IOptions extends ICommandArguments {
  quality: QualityOption;
}

export const command = 'video <productId> <filepath>';

export const describe = 'Download video of an episode';

export const builder = (yargs: Argv): Argv => (
  yargs
    .option('quality', {
      string: true,
      choices: Object.keys(Quality),
      default: '1080p',
      coerce: value => chain(value).compact().uniq().value(),
      description: 'Video quality'
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, filepath, quality } = argv;
  console.info(`Downloading video of "${productId}" (Quality : ${quality})`);
  const _filepath = await download.video(productId, filepath, quality);
  console.info(`Finished: ${_filepath}`);
};
