import { Arguments } from 'yargs';

export interface ICommandArguments extends Arguments {
  productId: string;
  filepath: string;
}
