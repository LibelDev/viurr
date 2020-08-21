import { Argv } from 'yargs';
import * as episode from './episode';
import * as series from './series';

export const command = 'inspect';

export const describe = 'Inspect details of a programme';

export const builder = (yargs: Argv): Argv => (
  yargs
    .command(episode)
    .command(series)
    .demandCommand(1, 'Specify --help to see available commands')
);
