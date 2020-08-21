import fs from 'fs';

const { access } = fs.promises;

/**
 * Check whether the given filepath exists
 * 
 * @async
 * @param {string} filepath
 * @returns {Boolean} `true` if the filepath exists, otherwise `false`
 */
export default async (filepath: string): Promise<boolean> => {
  try {
    await access(filepath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};
