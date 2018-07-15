import yargs from 'yargs';
import * as episode from './episode';
import * as series from './series';

export const command = 'download';

export const describe = 'Download files of a programme';

export const builder = (yargs: yargs.Argv) => (
  yargs
    .command(episode as yargs.CommandModule)
    .command(series as yargs.CommandModule)
    .demandCommand(1, 'Please specify what to download, episode or series?')
);
