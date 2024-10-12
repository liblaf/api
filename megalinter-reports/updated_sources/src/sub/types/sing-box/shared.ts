export type DNSStrategy =
  | 'prefer_ipv4'
  | 'prefer_ipv6'
  | 'ipv4_only'
  | 'ipv6_only'

export interface ListenFields {
  listen?: string
  listen_port?: number
  tcp_fast_open?: boolean
  tcp_multi_path?: boolean
  udp_fragment?: boolean
  udp_timeout?: string
  detour?: string
  sniff?: boolean
  sniff_override_destination?: boolean
  sniff_timeout?: string
  domain_strategy?: DNSStrategy
  udp_disable_domain_unmapping?: boolean
}

export interface DialFields {
  // TODO: Add more fields
  tcp_fast_open?: boolean
  tcp_multi_path?: boolean
}
