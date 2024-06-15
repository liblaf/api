import type { Provider } from "@lib/sub/provider/abc";
import type { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export function newAuto(): SmartGroup {
	return {
		name: GROUPS.AUTO,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			return true;
		},
	};
}
