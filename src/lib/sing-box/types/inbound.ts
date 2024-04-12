import { Query } from "../query";

export type Inbound = InboundMixed;

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

export function defaultInbounds(query: Query): Inbound[] {
  return [
    {
      type: "mixed",
      tag: "in:mixed",
      listen: "0.0.0.0",
      listen_port: 10080,
      sniff: true,
    },
  ];
}
