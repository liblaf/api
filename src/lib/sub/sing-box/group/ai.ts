import { COUNTRIES } from "@lib/sub/infer/country";
import { SmartGroup } from "./abc";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";
import { Provider } from "@lib/sub/provider/abc";

const COUNTRIES_EXCLUDE = new Set([COUNTRIES.HK, COUNTRIES.MO, COUNTRIES.OT]);

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

  extend(outbounds: Outbound[], provider: Provider): Outbound[] {
    for (const outbound of outbounds) {
      if (provider.isEmby(outbound.tag)) continue;
      const country = provider.country(outbound.tag);
      if (COUNTRIES_EXCLUDE.has(country)) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
