#!/usr/bin/env node
import debugFactory from 'debug';
import yargs from 'yargs';
import * as download from './commands/download';
import * as inspect from './commands/inspect';

const debug = debugFactory('viurr:cli');

yargs
  .command(download as yargs.CommandModule)
  .command(inspect as yargs.CommandModule)
  .demandCommand(1, 'Specify --help to see available commands')
  .fail((message, err) => {
    if (message) {
      console.error(message);
    }
    if (err) {
      debug(err);
      console.error(`
        Please visit the GitHub repository [https://github.com/kitce/viurr] for more details,
        or submit an issue to report a bug with the steps to reproduce and the following error:.
      `);
      console.error(err);
    }
    process.exit(1);
  })
  .parse();
