import type { Provider } from "@lib/sub/provider/abc";
import type { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export function media(): SmartGroup {
	return {
		name: GROUPS.MEDIA,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			if (provider.isLimit(outbound)) return false;
			const rate: number = provider.rate(outbound);
			if (rate > 1) return false;
			return true;
		},
	};
}
