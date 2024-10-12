import { ClashMode, DnsTag, GeoIPTag, GeoSiteTag, OutboundTag } from '../const'
import type { SingboxQuery } from './query'
import type { DNSStrategy } from './shared'

export interface DNS {
  servers?: DNSServer[]
  rules?: DNSRule[]
  final?: string
  strategy?: DNSStrategy
  disable_cache?: boolean
  disable_expire?: boolean
  independent_cache?: boolean
  reverse_mapping?: boolean
  client_subnet?: string
  fakeip?: FakeIP
}

interface DNSServer {
  tag: string
  address: string
  address_resolver?: string
  address_strategy?: DNSStrategy
  strategy?: DNSStrategy
  detour?: string
  client_subnet?: string
}

type DNSRule = HeadlessRule & {
  server: string
  disable_cache?: boolean
  rewrite_ttl?: number
  client_subnet?: string
}

type HeadlessRule = DefaultFields | LogicalFields

interface DefaultFields {
  // TODO: add more fields
  inbound?: string[]
  query_type?: string[]
  clash_mode?: string
  rule_set?: string[]
  invert?: boolean
  outbound?: string[]
}

interface LogicalFields {
  type: 'logical'
  mode: 'and' | 'or'
  rules: HeadlessRule[]
}

interface FakeIP {
  enabled?: boolean
  inet4_range?: string
  inet6_range?: string
}

export function configDNS (query: SingboxQuery): DNS {
  const dns: DNS = {
    servers: [
      { tag: DnsTag.PROXY, address: 'https://8.8.8.8/dns-query' },
      {
        tag: DnsTag.LOCAL,
        address: query.preset?.includes('ios') ? '8.8.8.8' : 'local',
        detour: OutboundTag.DIRECT
      },
      { tag: DnsTag.REJECT, address: 'rcode://refused' }
    ],
    rules: [
      { outbound: ['any'], server: DnsTag.LOCAL },
      {
        rule_set: [GeoSiteTag.ADS],
        server: DnsTag.REJECT,
        disable_cache: true
      },
      { rule_set: [GeoSiteTag.PRIVATE], server: DnsTag.LOCAL },
      { clash_mode: ClashMode.DIRECT, server: DnsTag.LOCAL },
      { clash_mode: ClashMode.GLOBAL, server: DnsTag.PROXY },
      { rule_set: [GeoSiteTag.CN], server: DnsTag.LOCAL },
      {
        type: 'logical',
        mode: 'and',
        rules: [
          { rule_set: [GeoSiteTag.PROXY], invert: true },
          { rule_set: [GeoIPTag.CN] }
        ],
        server: DnsTag.PROXY,
        client_subnet: '101.6.6.6'
      }
    ],
    final: DnsTag.PROXY,
    independent_cache: true
  }
  return dns
}
