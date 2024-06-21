import type { Provider } from "@lib/sub/provider/abc";
import { SmartGroup } from "./abc";
import { AI_COUNTRIES_EXCLUDE, GROUPS } from "./shared";

export class Ai extends SmartGroup {
  name: string = GROUPS.AI;

  filter(name: string, provider: Provider): boolean {
    if (provider.isEmby(name)) return false;
    const country = provider.country(name);
    if (AI_COUNTRIES_EXCLUDE.has(country)) return false;
    return true;
  }
}
