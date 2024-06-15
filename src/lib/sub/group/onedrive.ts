import type { Provider } from "@lib/sub/provider/abc";
import type { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export function newOnedrive(): SmartGroup {
	return {
		name: GROUPS.ONEDRIVE,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			const rate: number = provider.rate(outbound);
			if (rate > 1) return false;
			return true;
		},
	};
}
