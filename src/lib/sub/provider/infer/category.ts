export function inferExcluded(name: string): boolean {
  return !!name.match(
    /Expire|Traffic|官网|备用|重置|流量|到期|套餐|剩余|工作室|请|全局代理|忘记|ZA|EIP|海外|续费|📝/,
  );
}
export function inferEmby(name: string): boolean {
  return !!name.match(/emby/i);
}

export function inferLimit(name: string): boolean {
  return !!name.match(/限速/i);
}
