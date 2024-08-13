export type ListenFields = {
  // TODO: Add more fields
  listen?: string;
  listen_port?: number;
  tcp_fast_open?: boolean;
  tcp_multi_path?: boolean;
  sniff?: boolean;
  sniff_override_destination?: boolean;
  domain_strategy?: DomainStrategy;
};

export type DialFields = {
  // TODO: Add more fields
  tcp_fast_open?: boolean;
  tcp_multi_path?: boolean;
};

export type DomainStrategy =
  | "prefer_ipv4"
  | "prefer_ipv6"
  | "ipv4_only"
  | "ipv6_only";
