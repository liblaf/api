import { isEmby } from "@/lib/sub/infer/category";
import { inferRate } from "@/lib/sub/infer/rate";
import { SmartGroup } from ".";
import { Outbound, OutboundURLTest } from "../config/outbound";
import { OutboundTag } from "../config/shared";

export class OneDrive implements SmartGroup {
  tag: string = OutboundTag.ONEDRIVE;
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
      if (isEmby(outbound.tag)) continue;
      const rate: number = inferRate(outbound.tag);
      if (rate < 0.2) {
        this.outbounds.push(outbound.tag);
        continue;
      }
    }
    return [];
  }
}
