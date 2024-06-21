import type { Provider } from "@lib/sub/provider/abc";
import { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export class Emby extends SmartGroup {
	name: string = GROUPS.EMBY;

	filter(outbound: string, provider: Provider): boolean {
		if (provider.isEmby(outbound)) return true;
		if (provider.isLimit(outbound)) return false;
		const rate: number = provider.rate(outbound);
		if (rate > 0.5) return false;
		return true;
	}
}
