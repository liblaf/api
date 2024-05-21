import { Provider } from "@lib/sub/provider/abc";
import {
  Outbound,
  OutboundSelector,
  OutboundURLTest,
} from "../config/outbound";

export interface SmartGroup {
  tag: string;
  outbounds: string[];
  build(): OutboundSelector | OutboundURLTest;
  extend(outbounds: Outbound[], provider: Provider): Outbound[];
}
