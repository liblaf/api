import { COUNTRIES, inferCountry } from "@/lib/sub/infer/country";
import { SmartGroup } from ".";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";

export class Auto implements SmartGroup {
  tag: string = OutboundTag.AUTO;
  outbounds: string[] = [];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://cp.cloudflare.com",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country === COUNTRIES.OT) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
