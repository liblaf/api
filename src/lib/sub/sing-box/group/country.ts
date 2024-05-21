import { COUNTRIES, inferCountry } from "@lib/sub/infer/country";
import { SmartGroup } from "./abc";
import {
  Outbound,
  OutboundSelector,
  OutboundURLTest,
} from "../config/outbound";
import { Provider } from "@lib/sub/provider/abc";

export class Country implements SmartGroup {
  tag: string;
  outbounds: string[] = [];

  constructor(tag: string) {
    this.tag = tag;
  }

  build(): OutboundSelector | OutboundURLTest {
    if (this.tag == COUNTRIES.OT) {
      return {
        tag: this.tag,
        type: "selector",
        outbounds: this.outbounds,
      };
    }
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
      if (country !== this.tag) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
