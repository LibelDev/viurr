import type { Argv } from 'yargs';
import * as cover from './cover';
import * as subtitle from './subtitle';
import * as video from './video';

export const command = 'episode';

export const describe = 'Download files of an episode';

export const builder = (yargs: Argv): Argv => (
  yargs
    .command(cover)
    .command(subtitle)
    .command(video)
    .demandCommand(1, 'Specify --help to see available commands')
);
