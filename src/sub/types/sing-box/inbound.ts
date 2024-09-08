import type { SingboxQuery } from "./query";
import type { ListenFields } from "./shared";

export type Inbound = InboundBase | InboundMixed | InboundTun;

export type InboundBase = {
  type: string;
  tag: string;
};

type InboundMixed = InboundBase &
  ListenFields & {
    type: "mixed";
    users?: { username: string; password: string }[];
    set_system_proxy?: boolean;
  };

type InboundTun = InboundBase &
  ListenFields & {
    // TODO: add more fields
    type: "tun";
    inet4_address?: string; // TODO: deprecated in sing-box 1.10.0
    inet6_address?: string; // TODO: deprecated in sing-box 1.10.0
    auto_route?: boolean;
    strict_route?: boolean;
  };

export function configInbounds({
  "in.mixed": mixed,
  "in.mixed.port": port,
  "in.tun": tun,
}: SingboxQuery): Inbound[] {
  const inbounds: Inbound[] = [];
  if (mixed) {
    inbounds.push({
      type: "mixed",
      tag: "in:mixed",
      listen: "0.0.0.0",
      listen_port: port,
    } satisfies InboundMixed);
  }
  if (tun) {
    inbounds.push({
      type: "tun",
      tag: "in:tun",
      inet4_address: "172.19.0.1/30",
      inet6_address: "fdfe:dcba:9876::1/126",
      auto_route: true,
      strict_route: true,
    } satisfies InboundTun);
  }
  return inbounds;
}
