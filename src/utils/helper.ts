// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isObject = <T extends Record<string, unknown>>(value: any): value is T =>
  typeof value === 'object' &&
  typeof value !== 'function' &&
  value !== undefined;

export { isObject };
