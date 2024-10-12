import { type DNS, configDNS } from './dns'
import { type Experimental, configExperimental } from './experimental'
import { type Inbound, configInbounds } from './inbound'
import { type Log, configLog } from './log'
import { type Outbound, configOutbounds } from './outbound'
import type { SingboxQuery } from './query'
import { type Route, configRoute } from './route'

export interface Singbox {
  log?: Log
  dns?: DNS
  ntp?: any // TODO: add NTP Config
  inbounds?: Inbound[]
  outbounds?: Outbound[]
  route?: Route
  experimental?: Experimental
}

export function configSingbox (query: SingboxQuery): Singbox {
  return {
    log: configLog(query),
    dns: configDNS(query),
    inbounds: configInbounds(query),
    outbounds: configOutbounds(query),
    route: configRoute(query),
    experimental: configExperimental(query)
  }
}
