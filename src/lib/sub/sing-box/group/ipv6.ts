import { COUNTRIES, inferCountry } from "@/lib/sub/infer/country";
import { SmartGroup } from ".";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";

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

  filter(outbounds: Outbound[]): Outbound[] {
    const outboundsIPv6: Outbound[] = [];
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country === COUNTRIES.OT) continue;
      const outboundIPv6: Outbound = structuredClone(outbound);
      outboundIPv6.tag += "[IPv6]";
      outboundsIPv6.push(outboundIPv6);
      this.outbounds.push(outboundIPv6.tag);
    }
    return outboundsIPv6;
  }
}