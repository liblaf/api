import type { SmartGroup } from "./abc";
import { newAi } from "./ai";
import { newAuto } from "./auto";
import { newBalanced } from "./balanced";
import { newCountry } from "./country";
import { newEmby } from "./emby";
import { newMedia } from "./media";
import { newOnedrive } from "./onedrive";

export function makeSmartGroup(name: string): SmartGroup {
	switch (name) {
		case "ai":
			return newAi();
		case "auto":
			return newAuto();
		case "balance":
			return newBalanced();
		case "emby":
			return newEmby();
		case "ipv6": // TODO
			throw new Error("Not implemented");
		case "media":
			return newMedia();
		case "onedrive":
			return newOnedrive();
		default:
			return newCountry(name);
	}
}
