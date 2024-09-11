import type { Outbound } from "@sub/types/sing-box/outbound";

export type DummySubscription = {
  base64?: string;
  uri?: string;
  singbox?: Outbound;
};
