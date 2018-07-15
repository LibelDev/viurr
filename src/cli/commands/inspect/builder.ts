import yargs from 'yargs';

export interface Options extends yargs.Arguments {
  productId: string;
  json: boolean;
}

export default (yargs: yargs.Argv) => (
  yargs
    .option('json', {
      boolean: true,
      description: 'Print the result in JSON format'
    })
);
