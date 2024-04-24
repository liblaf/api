import { Query } from "../query";
import { ClashMode, OutboundTag } from "./shared";

export type DNS = {
  servers?: DNSServer[];
  rules?: DNSRule[];
  final?: string;
  independent_cache?: boolean;
  client_subnet?: string;
  fakeip?: FakeIP;
};

export type DNSServer = {
  tag: string;
  address: string;
  address_resolver?: string;
  address_strategy?: string;
  detour?: string;
  client_subnet?: string;
};

export type DNSRule = _DNSRule & {
  server: string;
  disable_cache?: boolean;
  client_subnet?: string;
};

type _DNSRule = DNSRuleDefault | DNSRuleLogical;

type DNSRuleDefault = {
  query_type?: (number | string)[];
  clash_mode?: ClashMode;
  rule_set?: string[];
  invert?: boolean;
  outbound?: "any" | string[];
};

type DNSRuleLogical = {
  type: "logical";
  mode: "and" | "or";
  rules: _DNSRule[];
};

type FakeIP = {
  enabled?: boolean;
  inet4_range?: string;
  inet6_range?: string;
};

export function defaultDNS({ tun }: Query): DNS {
  const dns: DNS = {
    servers: [
      {
        tag: DnsTag.CLOUDFLARE,
        address: "https://cloudflare-dns.com/dns-query",
        address_resolver: DnsTag.LOCAL,
      },
      {
        tag: DnsTag.LOCAL,
        address: "local",
        detour: OutboundTag.DIRECT,
      },
      {
        tag: DnsTag.REJECT,
        address: "rcode://success",
      },
    ],
    rules: [
      {
        rule_set: ["geosite:private"],
        server: DnsTag.LOCAL,
      },
      {
        outbound: "any",
        server: DnsTag.LOCAL,
      },
      {
        rule_set: ["geosite:category-ads-all"],
        server: DnsTag.REJECT,
        disable_cache: true,
      },
      {
        clash_mode: "direct",
        server: DnsTag.LOCAL,
      },
      {
        clash_mode: "global",
        server: DnsTag.CLOUDFLARE,
      },
      {
        rule_set: [
          "geosite:apple-cn",
          "geosite:category-games@cn",
          "geosite:cn",
          "geosite:geolocation-cn",
          "geosite:microsoft@cn",
          "geosite:onedrive",
          "geosite:steam@cn",
        ],
        server: DnsTag.LOCAL,
      },
      // TODO: sing-box 1.9.0-alpha.2+
      // {
      //   type: "logical",
      //   mode: "and",
      //   rules: [
      //     {
      //       rule_set: ["geosite:geolocation-!cn"],
      //       invert: true,
      //     },
      //     {
      //       rule_set: ["geoip:cn"],
      //     },
      //   ],
      //   server: DnsTag.CLOUDFLARE,
      //   client_subnet: "101.6.6.6", // any China client IP address
      // },
    ],
    final: DnsTag.CLOUDFLARE,
    independent_cache: true,
  };
  if (tun) {
    dns.servers?.push({
      tag: DnsTag.FAKEIP,
      address: "fakeip",
    });
    dns.rules?.push({
      query_type: ["A", "AAAA"],
      server: DnsTag.FAKEIP,
    });
    dns.fakeip = {
      enabled: true,
      inet4_range: "198.18.0.0/15",
      inet6_range: "fc00::/18",
    };
  }
  return dns;
}

const DnsTag = {
  CLOUDFLARE: "dns:cloudflare",
  LOCAL: "dns:local",
  REJECT: "dns:reject",
  FAKEIP: "dns:fakeip",
};
