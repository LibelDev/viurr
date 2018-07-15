import fs from 'fs';
import util from 'util';

const access = util.promisify(fs.access);

export default async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};
