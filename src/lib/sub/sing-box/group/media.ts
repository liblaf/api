import { SmartGroup } from "./abc";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";
import { Provider } from "@lib/sub/provider/abc";

export class Media implements SmartGroup {
  tag: string = OutboundTag.MEDIA;
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
      const tag = outbound.tag;
      if (provider.isEmby(tag)) continue;
      const rate = provider.rate(outbound.tag);
      if (rate >= 2) continue;
      this.outbounds.push(tag);
    }
    return [];
  }
}
