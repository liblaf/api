export function isExcluded(name: string): boolean {
  return !!name.match(/距离下次重置剩余/);
}

export function isEmby(name: string): boolean {
  return !!name.match(/emby/i);
}

export function isLimit(name: string): boolean {
  return !!name.match(/限速/i);
}
