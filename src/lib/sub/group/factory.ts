import type { SmartGroup } from "./abc";
import { ai } from "./ai";
import { auto } from "./auto";
import { country } from "./country";
import { emby } from "./emby";
import { onedrive } from "./onedrive";

export function makeSmartGroup(name: string): SmartGroup {
	switch (name) {
		case "ai":
			return ai();
		case "auto":
			return auto();
		case "emby":
			return emby();
		case "good": // TODO
			throw new Error("Not implemented");
		case "ipv6": // TODO
			throw new Error("Not implemented");
		case "media": // TODO
			throw new Error("Not implemented");
		case "onedrive":
			return onedrive();
		default:
			return country(name);
	}
}
