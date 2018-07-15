import yargs from 'yargs';

export interface CommandArguments extends yargs.Arguments {
  productId: string;
  filePathTemplate: string;
}
