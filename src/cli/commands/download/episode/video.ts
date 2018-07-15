import {chain} from 'lodash';
import yargs from 'yargs';
import {QualityChoice} from '../../../../config/config';
import * as download from '../../../../lib/download';
import {CommandArguments} from '../builder';

export interface Options extends CommandArguments {
  quality: QualityChoice[];
}

export const command = 'video <productId> <filePathTemplate>';

export const describe = 'Download video(s) of an episode';

export const builder = (yargs: yargs.Argv) => (
  yargs
    .option('quality', {
      array: true,
      string: true,
      choices: ['1080p', '720p', '480p', '240p'],
      default: ['1080p'],
      coerce: value => chain(value).compact().uniq().value(),
      description: 'Video quality'
    })
);

export const handler = async (argv: Options) => {
  const {productId, filePathTemplate, quality: qualities} = argv;
  for (const quality of qualities) {
    console.info(`Downloading video of "${productId}" (Quality : ${quality})`);
    const filePath = await download.video(productId, filePathTemplate, quality);
    console.info(`Finished : ${filePath}`);
  }
};
