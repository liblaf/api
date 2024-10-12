export function isExcluded (name: string): boolean {
  return !(name.match(/到期|剩余|套餐|网址|过期/) == null)
}

export function isEmby (name: string): boolean {
  return !(name.match(/emby/i) == null)
}

export function isLimit (name: string): boolean {
  return !(name.match(/限速/i) == null)
}
