import { COUNTRIES, inferCountry } from "@/lib/sub/infer/country";
import { SmartGroup } from ".";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";

const AI_EXCLUDE_COUNTRIES = new Set([
  COUNTRIES.HK,
  COUNTRIES.MO,
  COUNTRIES.OT,
]);

export class AI implements SmartGroup {
  tag: string = OutboundTag.AI;
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
      if (AI_EXCLUDE_COUNTRIES.has(country)) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
