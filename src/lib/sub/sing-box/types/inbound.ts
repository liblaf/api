import { Query } from "../query";

export type Inbound = InboundMixed | InboundTun;

type ListenFields = {
  listen: string;
  listen_port?: number;
  sniff?: boolean;
};

type InboundMixed = {
  type: "mixed";
  tag: string;
  users?: {
    username: string;
    password: string;
  }[];
} & ListenFields;

type InboundTun = {
  type: "tun";
  tag: string;
  inet4_address: string;
  inet6_address?: string;
  auto_route?: boolean;
  strict_route?: boolean;
};

export function defaultInbounds({ listen_port, mixed, tun }: Query): Inbound[] {
  const inbounds: Inbound[] = [];
  if (mixed)
    inbounds.push({
      type: "mixed",
      tag: "in:mixed",
      listen: "0.0.0.0",
      listen_port: listen_port,
      sniff: true,
    });
  if (tun)
    inbounds.push({
      type: "tun",
      tag: "in:tun",
      inet4_address: "172.19.0.1/30",
      inet6_address: "fdfe:dcba:9876::1/126",
      auto_route: true,
      strict_route: false,
    });
  return inbounds;
}
