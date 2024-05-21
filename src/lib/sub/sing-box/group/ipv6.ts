import { SmartGroup } from "./abc";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";
import { Provider } from "@lib/sub/provider/abc";

export class IPv6 implements SmartGroup {
  tag: string = OutboundTag.IPv6;
  outbounds: string[] = [];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://api-ipv6.ip.sb/ip",
    };
  }

  extend(outbounds: Outbound[], provider: Provider): Outbound[] {
    const outboundsIPv6: Outbound[] = [];
    for (const outbound of outbounds) {
      if (provider.isEmby(outbound.tag)) continue;
      const outboundIPv6 = structuredClone(outbound);
      outboundIPv6.tag += "[IPv6]";
      outboundsIPv6.push(outboundIPv6);
      this.outbounds.push(outboundIPv6.tag);
    }
    return outboundsIPv6;
  }
}
