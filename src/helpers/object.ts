// eslint-disable-next-line @typescript-eslint/ban-types
export const getValueBySimilarKey = <T extends {}, K extends keyof T = keyof T> (object: T, key: string): T[K] | undefined => {
  const keys = Object.keys(object);
  const _key = keys.find((k) => k.includes(key));
  return _key ? object[_key as K] : undefined;
};
