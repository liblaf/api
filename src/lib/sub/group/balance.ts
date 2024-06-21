import type { Provider } from "@lib/sub/provider/abc";
import { SmartGroup } from "./abc";
import { AI_COUNTRIES_EXCLUDE, GROUPS } from "./shared";

export class Balance extends SmartGroup {
  name: string = GROUPS.BALANCE;

  filter(name: string, provider: Provider): boolean {
    if (provider.isEmby(name)) return false;
    const country = provider.country(name);
    if (AI_COUNTRIES_EXCLUDE.has(country)) return false;
    const rate = provider.rate(name);
    if (rate > 1) return false;
    return true;
  }
}
