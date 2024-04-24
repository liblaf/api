import {
  Outbound,
  OutboundSelector,
  OutboundURLTest,
} from "../config/outbound";

export interface SmartGroup {
  tag: string;
  outbounds: string[];
  build(): OutboundSelector | OutboundURLTest;
  filter(outbounds: Outbound[]): Outbound[];
}
