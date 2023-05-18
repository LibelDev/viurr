import type { Argv } from 'yargs';
import * as download from '../../../../download';
import { getEpisodeInfoString } from '../../../../lib/cli';
import { flipEnum } from '../../../../lib/enum';
import { LanguageFlagId, SubtitleLanguageName } from '../../../../types/types';
import type { ICommandArguments } from '../builder';

export interface IOptions extends ICommandArguments {
  languageId: LanguageFlagId;
}

export const command = 'subtitle <productId>';

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
      choices: Object.values(LanguageFlagId),
      default: '1',
      description: description.join('\n')
    })
);

export const handler = async (argv: IOptions): Promise<void> => {
  const { productId, languageId = LanguageFlagId.TraditionalChinese } = argv;
  const [, episode, _filepath] = await download.subtitle(productId, languageId);
  const language = flipEnum(LanguageFlagId)[languageId];
  const languageName = SubtitleLanguageName[language];
  const episodeInfoString = getEpisodeInfoString(episode);
  console.info(`Downloading subtitle of ${episodeInfoString} (Language: ${languageName})`);
  console.info(`Downloaded: ${_filepath}`);
};
