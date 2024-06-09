import type { SmartGroup } from "./abc";
import { ai } from "./ai";
import { auto } from "./auto";
import { balance } from "./balance";
import { country } from "./country";
import { emby } from "./emby";
import { media } from "./media";
import { onedrive } from "./onedrive";

export function makeSmartGroup(name: string): SmartGroup {
	switch (name) {
		case "ai":
			return ai();
		case "auto":
			return auto();
		case "balance":
			return balance();
		case "emby":
			return emby();
		case "ipv6": // TODO
			throw new Error("Not implemented");
		case "media":
			return media();
		case "onedrive":
			return onedrive();
		default:
			return country(name);
	}
}
