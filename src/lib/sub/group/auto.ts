import type { Provider } from "@lib/sub/provider/abc";
import { SmartGroup } from "./abc";
import { GROUPS } from "./shared";

export class Auto extends SmartGroup {
	name: string = GROUPS.AUTO;

	filter(name: string, provider: Provider): boolean {
		if (provider.isEmby(name)) return false;
		return true;
	}
}
