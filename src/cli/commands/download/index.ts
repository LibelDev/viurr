import { Argv, CommandModule } from 'yargs';
import * as episode from './episode';
import * as series from './series';

export const command = 'download';

export const describe = 'Download files of a programme';

export const builder = (yargs: Argv): Argv => (
  yargs
    .command(episode as CommandModule)
    .command(series as CommandModule)
    .demandCommand(1, 'Specify --help to see available commands')
);
