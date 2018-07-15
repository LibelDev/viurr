import {chain} from 'lodash';
import yargs from 'yargs';
import * as download from '../../../../lib/download';
import {CommandArguments} from '../builder';

export interface Options extends CommandArguments {
  language: string[];
}

export const command = 'subtitle <productId> <filePathTemplate>';

export const describe = 'Download subtitle of an episode';

export const builder = (yargs: yargs.Argv) => (
  yargs
    .option('language', {
      array: true,
      string: true,
      choices: ['1'], // TODO: find more available choices
      default: ['1'],
      coerce: value => chain(value).compact().uniq().value(),
      description: 'Subtitle language (omit this option to download all available subtitles)'
    })
);

export const handler = async (argv: Options) => {
  const {productId, filePathTemplate, language: languageIds} = argv;
  for (const languageId of languageIds) {
    console.info(`Downloading subtitle of "${productId}" (Language ID : ${languageId})`);
    const filePath = await download.subtitle(productId, filePathTemplate, languageId);
    console.info(`Finished : ${filePath}`);
  }
};
