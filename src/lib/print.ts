import isArray from 'lodash/isArray';
import isObjectLike from 'lodash/isObjectLike';
import prettyjson from 'prettyjson';

export default (data: any): void => {
  const _data = prettify(data);
  const output = prettyjson.render(_data);
  console.info(output);
};

function prettify (data: any): any {
  if (isArray(data)) {
    return data.map(prettify);
  }
  if (isObjectLike(data)) {
    const _data = {} as any;
    const keys = Object.keys(data);
    for (const key of keys) {
      const value = data[key];
      const _key = transform(key);
      _data[_key] = isObjectLike(value) ? prettify(value) : value;
    }
    return _data;
  }
  return data;
};

function transform (string: string): string {
  const upperCaseLetters = /[A-Z]/g;
  const underscores = /[_-]/g;
  const spaces = /\s+/g;
  return string
    .replace(underscores, ' ')
    .replace(upperCaseLetters, character => ' ' + character)
    .replace(/\b\w/g, character => character.toUpperCase())
    .replace(spaces, ' ')
    .trim();
}
