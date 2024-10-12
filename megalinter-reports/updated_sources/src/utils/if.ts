export function arrayIf<T> (condition: boolean, ...values: T[]): T[] {
  return condition ? values : []
}
