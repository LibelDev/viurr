import fs from 'fs/promises';
import path from 'path';

const PACKAGE_JSON_FILEPATH = path.resolve(__dirname, '../../package.json');

export const getSignature = async () => {
  const json = await fs.readFile(PACKAGE_JSON_FILEPATH, 'utf-8');
  const { displayName, version } = JSON.parse(json);
  return `${displayName} v${version}`;
};
