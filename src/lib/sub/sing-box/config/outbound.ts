import type { Params } from "../types";
import { OutboundTag } from "./const";
import type { DialFields } from "./shared";

export type Outbound =
  | OutboundBase
  | OutboundDirect
  | OutboundBlock
  | OutboundDNS
  | OutboundSelector
  | OutboundURLTest;

type OutboundBase = {
  type: string;
  tag: string;
};

// TODO: Add more fields

type OutboundDirect = OutboundBase & DialFields & { type: "direct" };

type OutboundBlock = OutboundBase & { type: "block" };

type OutboundDNS = OutboundBase & { type: "dns" };

export type OutboundSelector = OutboundBase & {
  type: "selector";
  outbounds: string[];
  default?: string;
  interrupt_exist_connections?: boolean;
};

export type OutboundURLTest = OutboundBase & {
  type: "urltest";
  outbounds: string[];
  url?: string;
  interval?: string;
  tolerance?: number;
  idle_timeout?: string;
  interrupt_exist_connections?: boolean;
};

export function createConfigOutbounds(params: Params): Outbound[] {
  return [
    {
      type: "direct",
      tag: OutboundTag.DIRECT,
      tcp_fast_open: true,
      tcp_multi_path: true,
    },
    { type: "block", tag: OutboundTag.REJECT },
    { type: "dns", tag: OutboundTag.DNS },
  ];
}
