import type { Query } from "../../query";
import {
  ClashMode,
  GeoIPTag,
  GeoSiteTag,
  OutboundTag,
  RuleSetTag,
} from "./const";

export type Route = {
  // TODO: Add more fields
  rules: RouteRule[];
  rule_set: RuleSet[];
  final?: string;
  auto_detect_interface?: boolean;
};

type RouteRule = {
  // TODO: Add more fields
  protocol?: string | string[];
  network?: "tcp" | "udp";
  ip_is_private?: boolean;
  port?: number | number[];
  clash_mode?: string;
  rule_set?: string | string[];
  invert?: boolean;
  outbound: string;
  // logical fields
  type?: "logical";
  mode?: "and" | "or";
  rules?: Omit<RouteRule, "outbound">[];
};

// TODO: Add more fields
type RuleSet = RuleSetRemote;

type RuleSetRemote = {
  type: "remote";
  tag: string;
  format: "source" | "binary";
  url: string;
  download_detour?: string;
  update_interval?: string;
};

export function createConfigRoute(query: Query): Route {
  return {
    rules: [
      {
        type: "logical",
        mode: "or",
        rules: [{ protocol: "dns" }, { port: 53 }],
        outbound: OutboundTag.DNS,
      },
      { rule_set: RuleSetTag.ADS, outbound: OutboundTag.REJECT },
      {
        ip_is_private: true,
        rule_set: RuleSetTag.PRIVATE,
        outbound: OutboundTag.DIRECT,
      },
      { clash_mode: ClashMode.DIRECT, outbound: OutboundTag.DIRECT },
      { clash_mode: ClashMode.GLOBAL, outbound: OutboundTag.PROXY },
      {
        type: "logical",
        mode: "or",
        rules: [
          { port: 853 },
          { network: "udp", port: 443 },
          { protocol: "stun" },
        ],
        outbound: OutboundTag.REJECT,
      },
      { rule_set: RuleSetTag.CN, outbound: OutboundTag.DIRECT },
      { rule_set: RuleSetTag.AI, outbound: OutboundTag.AI },
      { rule_set: RuleSetTag.EMBY, outbound: OutboundTag.EMBY },
      { rule_set: RuleSetTag.DOWNLOAD, outbound: OutboundTag.DOWNLOAD },
      { rule_set: RuleSetTag.MEDIA, outbound: OutboundTag.MEDIA },
    ],
    rule_set: ruleSets(),
    final: OutboundTag.PROXY,
    auto_detect_interface: true,
  };
}

function ruleSets(): RuleSet[] {
  const ruleSets: RuleSet[] = [];
  for (const E of [GeoIPTag, GeoSiteTag, RuleSetTag]) {
    let k: keyof typeof E;
    for (k in E) {
      const tag = E[k];
      ruleSets.push(ruleSetRemote(tag));
    }
  }
  return ruleSets;
}

function ruleSetRemote(tag: string): RuleSet {
  switch (tag) {
    default:
      return ruleSetRemoteBinary(
        tag,
        `https://api.liblaf.me/rule-set/${tag.replace(":", "/")}.srs`,
      );
  }
}

function ruleSetRemoteBinary(tag: string, url: string): RuleSet {
  return {
    type: "remote",
    tag,
    format: "binary",
    url: url,
    download_detour: OutboundTag.DIRECT,
  };
}
