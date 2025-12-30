export function exclude<T, Key extends keyof T>(
  entity: T,
  ...keys: Key[]
): Omit<T, Key> {
  const result = { ...entity };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
