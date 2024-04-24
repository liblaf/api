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
  domain_suffix?: string[];
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
  url: string;
  download_detour?: string;
};

export function defaultRoute(query: Query): Route {
  return {
    rules: [
      {
        type: "logical",
        mode: "or",
        rules: [{ protocol: ["dns"] }, { port: [53] }],
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
        domain_suffix: ["byr.pt"],
        outbound: OutboundTag.IPv6,
      },
      {
        rule_set: [
          "geoip:cn",
          "geosite:apple-cn",
          "geosite:category-games@cn",
          "geosite:cn",
          "geosite:geolocation-cn",
          "geosite:microsoft@cn",
          "geosite:onedrive",
          "geosite:steam@cn",
        ],
        outbound: OutboundTag.DIRECT,
      },
      {
        rule_set: [
          "geosite:bing",
          "geosite:openai",
          "ruleset:claude",
          "ruleset:gemini",
        ],
        outbound: OutboundTag.AI,
      },
      {
        rule_set: ["ruleset:emby"],
        outbound: OutboundTag.EMBY,
      },
    ],
    rule_set: [
      geoip("cn"),
      geoip("private"),
      geosite("apple-cn"),
      geosite("bing"),
      geosite("category-ads-all"),
      geosite("category-games@cn"),
      geosite("cn"),
      geosite("geolocation-!cn"),
      geosite("geolocation-cn"),
      geosite("microsoft@cn"),
      geosite("onedrive"),
      geosite("openai"),
      geosite("private"),
      geosite("steam@cn"),
      remoteBinary(
        "ruleset:claude",
        "https://raw.githubusercontent.com/NotSFC/for-sing-box-and-surge/master/sing-box/Claude/Claude.srs"
      ),
      remoteBinary(
        "ruleset:emby",
        "https://raw.githubusercontent.com/NotSFC/rulelist/main/sing-box/Emby/Emby.srs"
      ),
      remoteBinary(
        "ruleset:gemini",
        "https://raw.githubusercontent.com/NotSFC/for-sing-box-and-surge/master/sing-box/Gemini/Gemini.srs"
      ),
    ],
    final: "PROXY",
    auto_detect_interface: true,
  };
}

function geoip(tag: string): RuleSet {
  return remoteBinary(
    `geoip:${tag}`,
    `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geoip/${tag}.srs`
  );
}

function geosite(tag: string): RuleSet {
  return remoteBinary(
    `geosite:${tag}`,
    `https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/${tag}.srs`
  );
}

function remoteBinary(tag: string, url: string): RuleSet {
  return {
    type: "remote",
    tag: tag,
    format: "binary",
    url: proxy(url),
    download_detour: OutboundTag.DIRECT,
  };
}
