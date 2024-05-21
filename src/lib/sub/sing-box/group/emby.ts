import { SmartGroup } from "./abc";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";
import { Provider } from "@lib/sub/provider/abc";

export class Emby implements SmartGroup {
  tag: string = OutboundTag.EMBY;
  outbounds: string[] = [OutboundTag.DIRECT];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://emby.aca.best",
    };
  }

  extend(outbounds: Outbound[], provider: Provider): Outbound[] {
    for (const outbound of outbounds) {
      if (provider.isEmby(outbound.tag)) {
        this.outbounds.push(outbound.tag);
        continue;
      }
      const rate: number = provider.rate(outbound.tag);
      if (rate < 0.2) {
        this.outbounds.push(outbound.tag);
        continue;
      }
    }
    return [];
  }
}
