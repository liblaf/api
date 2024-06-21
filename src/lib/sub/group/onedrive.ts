import type { Provider } from "@lib/sub/provider/abc";
import { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export class OneDrive extends SmartGroup {
  name: string = GROUPS.ONEDRIVE;

  filter(outbound: string, provider: Provider): boolean {
    if (provider.isEmby(outbound)) return false;
    const rate: number = provider.rate(outbound);
    if (rate > 1) return false;
    return true;
  }
}
