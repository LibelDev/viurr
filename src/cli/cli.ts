#!/usr/bin/env node
import Debugger from 'debug';
import yargs from 'yargs';
import * as download from './commands/download';
import * as inspect from './commands/inspect';

const debug = Debugger('viuer:cli');

yargs
  .command(download as yargs.CommandModule)
  .command(inspect as yargs.CommandModule)
  .demandCommand(1, 'Please specify the command')
  .showHelpOnFail(true, 'Specify --help for available options')
  .fail((message, err) => {
    if (message) {
      console.error(message);
    }
    if (err && err.message) {
      debug(err);
      console.error(err.message);
    }
    process.exit(1);
  })
  .parse();
