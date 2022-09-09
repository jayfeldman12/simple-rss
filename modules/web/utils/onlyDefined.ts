export const onlyDefined = <T>(items: Array<T | null | undefined>): T[] =>
  items.filter(x => x !== null && x !== undefined) as T[];
