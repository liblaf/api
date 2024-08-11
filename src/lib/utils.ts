export function arrayIf<T>(condition: boolean, ...values: T[]): T[] {
  if (condition) return values;
  return [];
}

export function objectIf<T>(condition: boolean, value: T): T | undefined {
  if (condition) return value;
  return undefined;
}

export function proxyURL(url: string): string {
  return `https://api.liblaf.me/proxy/${url}`;
}
