export function isExcluded(name: string): boolean {
  return !!name.match(/到期|剩余|套餐|网址|过期/);
}

export function isEmby(name: string): boolean {
  return !!name.match(/emby/i);
}

export function isLimit(name: string): boolean {
  return !!name.match(/限速/i);
}
