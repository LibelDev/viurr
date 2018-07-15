#!/usr/bin/env node
import yargs from 'yargs';
import * as download from './commands/download';
import * as inspect from './commands/inspect';

yargs
  .command(download as yargs.CommandModule)
  .command(inspect as yargs.CommandModule)
  .demandCommand(1, 'Please specify the command')
  .showHelpOnFail(true, 'Specify --help for available options')
  .fail((message, err) => {
    if (message) {
      console.error(message);
    }
    if (err) {
      console.error(err);
    }
    process.exit(1);
  })
  .parse();
