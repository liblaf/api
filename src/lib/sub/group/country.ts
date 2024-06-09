import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES } from "../provider/infer/country";
import type { SmartGroup } from "./abc";

export function country(name: string): SmartGroup {
	const prettyName = COUNTRIES[name] as string;
	return {
		name: prettyName,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			const country = provider.country(outbound);
			if (country !== prettyName) return false;
			return true;
		},
	};
}
