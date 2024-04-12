import { Query } from "../query";
import { ClashMode, OutboundTag } from "./shared";

export type DNS = {
  servers?: DNSServer[];
  rules?: DNSRule[];
  final?: string;
  client_subnet?: string;
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

export function defaultDNS(query: Query): DNS {
  return {
    servers: [
      {
        tag: DNSServerTag.CLOUDFLARE,
        address: "https://cloudflare-dns.com/dns-query",
        address_resolver: DNSServerTag.LOCAL,
      },
      {
        tag: DNSServerTag.LOCAL,
        address: "local",
        detour: OutboundTag.DIRECT,
      },
      {
        tag: DNSServerTag.REJECT,
        address: "rcode://success",
      },
    ],
    rules: [
      {
        rule_set: ["geosite:private"],
        server: DNSServerTag.LOCAL,
      },
      {
        outbound: "any",
        server: DNSServerTag.LOCAL,
      },
      {
        rule_set: ["geosite:category-ads-all"],
        server: DNSServerTag.REJECT,
      },
      {
        clash_mode: "direct",
        server: DNSServerTag.LOCAL,
      },
      {
        clash_mode: "global",
        server: DNSServerTag.CLOUDFLARE,
      },
      {
        rule_set: [
          "geoip:cn",
          "geosite:apple@cn",
          "geosite:category-games@cn",
          "geosite:cn",
          "geosite:geolocation-cn",
        ],
        server: DNSServerTag.LOCAL,
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
      //   server: DNSServerTag.CLOUDFLARE,
      //   client_subnet: "101.6.6.6", // any China client IP address
      // },
    ],
    final: DNSServerTag.CLOUDFLARE,
  };
}

const DNSServerTag = {
  CLOUDFLARE: "dns:cloudflare",
  LOCAL: "dns:local",
  REJECT: "dns:reject",
};
