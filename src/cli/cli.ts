#!/usr/bin/env node
import debugFactory from 'debug';
import yargs from 'yargs';
import * as download from './commands/download';
import * as inspect from './commands/inspect';

const debug = debugFactory('viurr:cli');

const errorReportMessage = `
Something went wrong!

  Please check if you have passed the correct product ID and other parameters.
  If you think this is an issue, please visit the GitHub repository [https://github.com/kitce/viurr]
  for more details, or submit an issue about the following error and with the steps to reproduce it:
`;

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
      console.error(errorReportMessage);
      console.error(err);
      console.error('');
    }
    process.exit(1);
  })
  .parse();
