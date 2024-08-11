import { arrayIf } from "@lib/utils";
import type { Params } from "../types";
import type { ListenFields } from "./shared";

export type Inbound = InboundBase | InboundMixed | InboundTUN;

type InboundBase = {
  type: string;
  tag: string;
};

// TODO: Add more fields

type InboundMixed = InboundBase & {
  type: "mixed";
  listen: string;
} & ListenFields;

type InboundTUN = InboundBase & {
  type: "tun";
  inet4_address?: string | string[];
  inet6_address?: string | string[];
  auto_route?: boolean;
  strict_route?: boolean;
} & ListenFields;

export function createConfigInbounds({ tun, mixed, port }: Params): Inbound[] {
  return [
    ...arrayIf(tun, {
      type: "tun",
      tag: "in:tun",
      inet4_address: "172.19.0.1/30",
      inet6_address: "fdfe:dcba:9876::1/126",
      auto_route: true,
      strict_route: true,
      sniff: true,
      domain_strategy: "prefer_ipv4",
    } satisfies InboundTUN),
    ...arrayIf(mixed, {
      type: "mixed",
      tag: "in:mixed",
      listen: "0.0.0.0",
      listen_port: port,
      sniff: true,
      domain_strategy: "prefer_ipv4",
    } satisfies InboundMixed),
  ];
}
