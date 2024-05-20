import { COUNTRIES, inferCountry } from "@lib/sub/infer/country";
import { SmartGroup } from ".";
import {
  Outbound,
  OutboundSelector,
  OutboundURLTest,
} from "../config/outbound";

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

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country !== this.tag) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
