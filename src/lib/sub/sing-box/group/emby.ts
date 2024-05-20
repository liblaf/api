import { isEmby } from "@lib/sub/infer/category";
import { inferRate } from "@lib/sub/infer/rate";
import { SmartGroup } from ".";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";

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

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      if (isEmby(outbound.tag)) {
        this.outbounds.push(outbound.tag);
        continue;
      }
      const rate: number = inferRate(outbound.tag);
      if (rate < 0.2) {
        this.outbounds.push(outbound.tag);
        continue;
      }
    }
    return [];
  }
}
