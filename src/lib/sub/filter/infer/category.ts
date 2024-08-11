export function isExcluded(name: string): boolean {
  return false;
}

export function isEmby(name: string): boolean {
  return !!name.match(/emby/i);
}

export function isLimit(name: string): boolean {
  return !!name.match(/限速/i);
}
