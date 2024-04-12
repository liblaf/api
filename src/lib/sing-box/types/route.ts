import { Query } from "../query";
import { ClashMode, OutboundTag, proxy } from "./shared";

export type Route = {
  rules?: RouteRule[];
  rule_set?: RuleSet[];
  final?: string;
  auto_detect_interface?: boolean;
};

type RouteRule = _RouteRule & {
  outbound: string;
};

type _RouteRule = RouteRuleDefault | RouteRuleLogical;

type RouteRuleDefault = {
  network?: ("tcp" | "udp")[];
  auth_user?: string[];
  protocol?: string[];
  ip_is_private?: boolean;
  port?: number[];
  clash_mode?: ClashMode;
  rule_set?: string[];
};

type RouteRuleLogical = {
  type: "logical";
  mode: "and" | "or";
  rules: _RouteRule[];
};

type RuleSet = RuleSetRemote;

type RuleSetCommon = {
  type: string;
  tag: string;
  format: "source" | "binary";
};

type RuleSetRemote = RuleSetCommon & {
  type: "remote";
  format: "source" | "binary";
  url: string;
  download_detour?: string;
};

export function defaultRoute(query: Query): Route {
  return {
    rules: [
      {
        type: "logical",
        mode: "or",
        rules: [{ protocol: ["dns"], port: [53] }],
        outbound: OutboundTag.DNS,
      },
      {
        rule_set: ["geoip:private", "geosite:private"],
        ip_is_private: true,
        outbound: OutboundTag.DIRECT,
      },
      {
        rule_set: ["geosite:category-ads-all"],
        outbound: OutboundTag.REJECT,
      },
      {
        clash_mode: "direct",
        outbound: OutboundTag.DIRECT,
      },
      {
        clash_mode: "global",
        outbound: OutboundTag.PROXY,
      },
      {
        type: "logical",
        mode: "or",
        rules: [
          { port: [853] },
          { network: ["udp"], port: [443] },
          { protocol: ["stun"] },
        ],
        outbound: OutboundTag.REJECT,
      },
      {
        rule_set: [
          "geoip:cn",
          "geosite:apple@cn",
          "geosite:category-games@cn",
          "geosite:cn",
          "geosite:geolocation-cn",
        ],
        outbound: OutboundTag.DIRECT,
      },
      {
        rule_set: ["geosite:bing", "geosite:openai"],
        outbound: OutboundTag.AI,
      },
    ],
    rule_set: [
      geoip("cn"),
      geoip("private"),
      geosite("apple@cn"),
      geosite("bing"),
      geosite("category-ads-all"),
      geosite("category-games@cn"),
      geosite("cn"),
      geosite("geolocation-!cn"),
      geosite("geolocation-cn"),
      geosite("openai"),
      geosite("private"),
    ],
    final: "PROXY",
    auto_detect_interface: true,
  };
}

function geoip(tag: string): RuleSet {
  return {
    type: "remote",
    tag: `geoip:${tag}`,
    format: "binary",
    url: proxy(
      `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geoip/${tag}.srs`,
    ),
  };
}

function geosite(tag: string): RuleSet {
  return {
    type: "remote",
    tag: `geosite:${tag}`,
    format: "binary",
    url: proxy(
      `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/${tag}.srs`,
    ),
  };
}
