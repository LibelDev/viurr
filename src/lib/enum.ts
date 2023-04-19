export const flipEnum = <T extends Record<string, string>> (enumObject: T): Record<T[keyof T], keyof T> => {
  const reversed = {} as Record<T[keyof T], keyof T>;
  for (const key in enumObject) {
    reversed[enumObject[key]] = key;
  }
  return reversed;
};
