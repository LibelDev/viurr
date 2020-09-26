import { Argv } from 'yargs';
import { ICommandArguments } from '../builder';
import * as download from '../../../../download';
import { LanguageFlag } from '../../../../types/viu.types';

export interface IOptions extends ICommandArguments {
  language: LanguageFlag;
}

export const command = 'subtitle <productId> [filepath]';

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
      description: description.join('\n')
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, filepath, language: languageId } = argv;
  const [series, episode, _filepath] = await download.subtitle(productId, filepath, languageId);
  console.info(`Downloading subtitle of "${series.title}" EP.${episode.number} "${episode.title}" (Language ID: ${languageId})`);
  console.info(`Downloaded: ${_filepath}`);
};
