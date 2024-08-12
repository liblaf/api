import { arrayIf, objectIf } from "@lib/utils";
import type { Query } from "../../query";
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

export function createConfigDNS(query: Query): DNS {
  return {
    servers: createServers(query),
    rules: createRules(query),
    final: DnsTag.PROXY,
    independent_cache: true,
    ...objectIf(query.tun, {
      fakeip: {
        enabled: true,
        inet4_range: "198.18.0.0/15",
        inet6_range: "fc00::/18",
      },
    }),
  };
}

function createServers({
  "dns-bootstrap": bootstrap,
  "dns-cn": cn,
  "dns-proxy": proxy,
  tun,
}: Query): DNSSever[] {
  // ref: <https://thu.services/services/#dns>
  bootstrap ||= "123.125.81.6"; // 360
  cn ||= "https://dns.alidns.com/dns-query";
  proxy ||= "https://cloudflare-dns.com/dns-query";
  const servers: DNSSever[] = [
    { tag: DnsTag.PROXY, address: proxy, address_resolver: DnsTag.BOOTSTRAP },
    { tag: DnsTag.CN, address: cn, address_resolver: DnsTag.BOOTSTRAP },
    { tag: DnsTag.BOOTSTRAP, address: bootstrap, detour: OutboundTag.DIRECT },
  ];
  servers.push(
    { tag: DnsTag.LOCAL, address: "local" },
    { tag: DnsTag.REJECT, address: "rcode://refused" },
  );
  if (tun) servers.push({ tag: DnsTag.FAKEIP, address: "fakeip" });
  return servers;
}

function createRules({ tun }: Query): DNSRule[] {
  const rules: DNSRule[] = [
    { outbound: "any", server: DnsTag.BOOTSTRAP },
    { rule_set: GeoSiteTag.ADS, server: DnsTag.REJECT, disable_cache: true },
    { rule_set: GeoSiteTag.PRIVATE, server: DnsTag.LOCAL },
    ...arrayIf(tun, {
      query_type: ["A", "AAAA"],
      server: DnsTag.FAKEIP,
      rewrite_ttl: 1,
    }),
    { clash_mode: ClashMode.DIRECT, server: DnsTag.CN },
    { clash_mode: ClashMode.GLOBAL, server: DnsTag.PROXY },
    { rule_set: GeoSiteTag.CN, server: DnsTag.CN },
    {
      type: "logical",
      mode: "and",
      rules: [
        { rule_set: GeoSiteTag.PROXY, invert: true },
        { rule_set: GeoIPTag.CN },
      ],
      server: DnsTag.PROXY,
      client_subnet: "101.6.6.6",
    },
  ];
  return rules;
}
