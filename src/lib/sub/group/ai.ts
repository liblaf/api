import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES } from "@lib/sub/provider/infer/country";
import type { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

const COUNTRIES_EXCLUDE = new Set([COUNTRIES.HK, COUNTRIES.MO, COUNTRIES.OT]);

export function newAi(): SmartGroup {
	return {
		name: GROUPS.AI,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			const country = provider.country(outbound);
			if (COUNTRIES_EXCLUDE.has(country)) return false;
			return true;
		},
	};
}
