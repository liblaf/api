import {
  ClashMode,
  GeoIPTag,
  GeoSiteTag,
  OutboundTag,
  RuleSetTag
} from '../const'
import type { SingboxQuery } from './query'
import type { RuleSet } from './rule-set'

export interface Route {
  rules?: RouteRule[]
  rule_set?: RuleSet[]
  final?: string
  auto_detect_interface?: boolean
  override_android_vpn?: boolean
  default_interface?: string
  default_mark?: number
}

type RouteRule = HeadlessRule & {
  outbound: string
}

type HeadlessRule = DefaultFields | LogicalFields

interface DefaultFields {
  // TODO: add more fields
  protocol?: string[]
  network?: 'tcp' | 'udp'
  ip_is_private?: boolean
  port?: number[]
  clash_mode?: string
  rule_set?: string[]
  invert?: boolean
}

interface LogicalFields {
  type: 'logical'
  mode: 'and' | 'or'
  rules: HeadlessRule[]
}

export function configRoute (query: SingboxQuery): Route {
  return {
    rules: [
      {
        type: 'logical',
        mode: 'or',
        rules: [{ protocol: ['dns'] }, { port: [53] }],
        outbound: OutboundTag.DNS
      },
      // {
      //   type: "logical",
      //   mode: "or",
      //   rules: [
      //     { port: [853] },
      //     { network: "udp", port: [443] },
      //     { protocol: ["stun"] },
      //   ],
      //   outbound: OutboundTag.REJECT,
      // },
      { rule_set: [RuleSetTag.ADS], outbound: OutboundTag.REJECT },
      {
        ip_is_private: true,
        rule_set: [RuleSetTag.PRIVATE],
        outbound: OutboundTag.DIRECT
      },
      { clash_mode: ClashMode.DIRECT, outbound: OutboundTag.DIRECT },
      { clash_mode: ClashMode.GLOBAL, outbound: OutboundTag.PROXY },
      { rule_set: [RuleSetTag.CN], outbound: OutboundTag.DIRECT },
      { rule_set: [RuleSetTag.AI], outbound: OutboundTag.AI },
      { rule_set: [RuleSetTag.DOWNLOAD], outbound: OutboundTag.DOWNLOAD },
      { rule_set: [RuleSetTag.EMBY], outbound: OutboundTag.EMBY },
      { rule_set: [RuleSetTag.MEDIA], outbound: OutboundTag.MEDIA }
    ],
    rule_set: configRuleSets(query),
    final: OutboundTag.PROXY,
    auto_detect_interface: true
  }
}

function configRuleSets (query: SingboxQuery): RuleSet[] {
  const ruleSets: RuleSet[] = []
  for (const E of [GeoIPTag, GeoSiteTag, RuleSetTag]) {
    for (const k in E) {
      ruleSets.push(configRuleSet(E[k as keyof typeof E]))
    }
  }
  return ruleSets
}

function configRuleSet (tag: string): RuleSet {
  return {
    type: 'remote',
    tag,
    format: 'binary',
    url: `https://api.liblaf.me/rules/sing/${tag.replace(':', '/')}.srs`,
    download_detour: OutboundTag.DIRECT
  }
}
