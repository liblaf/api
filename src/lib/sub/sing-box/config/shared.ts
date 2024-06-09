import { GROUPS } from "@lib/sub/group/shared";
import { COUNTRIES } from "@lib/sub/provider/infer/country";

export const OutboundTag = {
	...COUNTRIES,
	...GROUPS,
	DIRECT: "DIRECT",
	DNS: "DNS",
	PROXY: "PROXY",
	REJECT: "REJECT",
};

export type ClashMode = "rule" | "global" | "direct";

export function proxy(url: string): string {
	return `https://api.liblaf.me/proxy/${url}`;
}
