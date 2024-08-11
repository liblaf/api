import { arrayIf, objectIf } from "@lib/utils";
import type { Params } from "../types";
import { ClashMode, DnsTag, GeoIPTag, GeoSiteTag, OutboundTag } from "./const";
import type { DomainStrategy } from "./shared";

export type DNS = {
  servers?: DNSSever[];
  rules?: DNSRule[];
  final?: string;
  strategy?: DomainStrategy;
  disable_cache?: boolean;
  disable_expire?: boolean;
  independent_cache?: boolean;
  reverse_mapping?: boolean;
  client_subnet?: string;
  fakeip?: FakeIP;
};

type DNSSever = {
  tag: string;
  address: string;
  address_resolver?: string;
  address_strategy?: DomainStrategy;
  strategy?: DomainStrategy;
  detour?: string;
  client_subnet?: string;
};

type DNSRule = {
  // TODO: Add more fields
  query_type?: string | string[];
  clash_mode?: string;
  rule_set?: string | string[];
  invert?: boolean;
  outbound?: string | string[];
  server: string;
  disable_cache?: boolean;
  rewrite_ttl?: number;
  client_subnet?: string;
  //  logical fields
  type?: "logical";
  mode?: "and" | "or";
  rules?: Omit<DNSRule, "server">[];
};

type FakeIP = {
  enabled?: boolean;
  inet4_range?: string;
  inet6_range?: string;
};

export function createConfigDNS({ tun }: Params): DNS {
  return {
    servers: [
      {
        tag: DnsTag.CLOUDFLARE,
        address: "https://cloudflare-dns.com/dns-query",
        address_resolver: DnsTag.LOCAL,
      },
      { tag: DnsTag.LOCAL, address: "local", detour: OutboundTag.DIRECT },
      { tag: DnsTag.REJECT, address: "rcode://success" },
      ...arrayIf(tun, { tag: DnsTag.FAKEIP, address: "fakeip" }),
    ],
    rules: [
      { outbound: "any", server: DnsTag.LOCAL },
      { rule_set: GeoSiteTag.ADS, server: DnsTag.REJECT, disable_cache: true },
      { rule_set: GeoSiteTag.PRIVATE, server: DnsTag.LOCAL },
      ...arrayIf(tun, {
        query_type: ["A", "AAAA"],
        server: DnsTag.FAKEIP,
        rewrite_ttl: 1,
      }),
      { clash_mode: ClashMode.DIRECT, server: DnsTag.LOCAL },
      { clash_mode: ClashMode.GLOBAL, server: DnsTag.CLOUDFLARE },
      { rule_set: GeoSiteTag.CN, server: DnsTag.LOCAL },
      {
        type: "logical",
        mode: "and",
        rules: [
          { rule_set: GeoSiteTag.PROXY, invert: true },
          { rule_set: GeoIPTag.CN },
        ],
        server: DnsTag.CLOUDFLARE,
        client_subnet: "101.6.6.6",
      },
    ],
    final: DnsTag.CLOUDFLARE,
    independent_cache: true,
    ...objectIf(tun, {
      fakeip: {
        enabled: true,
        inet4_range: "198.18.0.0/15",
        inet6_range: "fc00::/18",
      },
    }),
  };
}
