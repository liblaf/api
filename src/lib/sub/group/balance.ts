import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES } from "@lib/sub/provider/infer/country";
import type { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

const COUNTRIES_EXCLUDE = new Set([COUNTRIES.HK, COUNTRIES.MO, COUNTRIES.OT]);

export function balance(): SmartGroup {
	return {
		name: GROUPS.BALANCE,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			if (provider.isLimit(outbound)) return false;
			const country = provider.country(outbound);
			if (COUNTRIES_EXCLUDE.has(country)) return false;
			const rate = provider.rate(outbound);
			if (rate > 1) return false;
			return true;
		},
	};
}
