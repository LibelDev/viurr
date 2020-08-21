import { Argv } from 'yargs';
import * as cover from './cover';
import * as description from './description';
import * as subtitle from './subtitle';
import * as video from './video';

export const command = 'series';

export const describe = 'Download files of a series';

export const builder = (yargs: Argv): Argv => (
  yargs
    .command(cover)
    .command(description)
    .command(subtitle)
    .command(video)
    .demandCommand(1, 'Specify --help to see available commands')
);
