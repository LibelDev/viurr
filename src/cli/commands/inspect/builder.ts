import type { Arguments, Argv } from 'yargs';

export interface ICommandArguments extends Arguments {
  productId: string;
  json: boolean;
}

export default (yargs: Argv): Argv => (
  yargs
    .option('json', {
      boolean: true,
      description: 'Print the result in JSON format'
    })
);
