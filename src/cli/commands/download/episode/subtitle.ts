import { chain } from 'lodash';
import { Argv } from 'yargs';
import * as download from '../../../../download';
import { ICommandArguments } from '../builder';
import { LanguageFlag } from '../../../../types/viu.types';

export interface IOptions extends ICommandArguments {
  language: LanguageFlag;
}

export const command = 'subtitle <productId> <filepath>';

export const describe = 'Download subtitle(s) of an episode';

const description = [
  'Subtitle language',
  '[1 : Chinese (Traditional)]',
  '[3 : English]',
  '[7 : Indonesian]',
  '[8 : Thai]',
  ''
];

export const builder = (yargs: Argv): Argv => (
  yargs
    .option('language', {
      string: true,
      choices: Object.values(LanguageFlag),
      default: '1',
      coerce: value => chain(value).compact().uniq().value(),
      description: description.join('\n')
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, filepath, language: languageId } = argv;
  console.info(`Downloading subtitle of "${productId}" (Language ID : ${languageId})`);
  const _filepath = await download.subtitle(productId, filepath, languageId);
  console.info(`Finished: ${_filepath}`);
};
