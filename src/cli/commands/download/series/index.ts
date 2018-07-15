import yargs from 'yargs';
import * as cover from './cover';
import * as description from './description';
import * as subtitle from './subtitle';
import * as video from './video';

export const command = 'series';

export const describe = 'Download files of a series';

export const builder = (yargs: yargs.Argv) => (
  yargs
    .command(cover)
    .command(description)
    .command(subtitle)
    .command(video)
);
