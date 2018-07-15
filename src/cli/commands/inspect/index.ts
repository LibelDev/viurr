import yargs from 'yargs';
import * as episode from './episode';
import * as series from './series';

export const command = 'inspect';

export const describe = 'Inspect details of a programme';

export const builder = (yargs: yargs.Argv) => (
  yargs
    .command(episode)
    .command(series)
    .demandCommand(1, 'Please specify what to inspect, episode or series?')
);
