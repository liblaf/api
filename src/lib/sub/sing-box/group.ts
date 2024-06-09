import type { SmartGroup } from "../group/abc";
import { ai } from "../group/ai";
import { makeSmartGroup } from "../group/factory";
import { GROUPS } from "../group/shared";
import type { Provider } from "../provider/abc";
import type { Config } from "./config";
import type { Outbound, OutboundSelector } from "./config/outbound";
import { OutboundTag } from "./config/shared";

interface SingBoxGroup {
	init(config: Config): void;
	process(config: Config, provider: Provider, outbound: Outbound): void;
}

export function makeSingBoxGroup(name: string): SingBoxGroup {
	const smart = makeSmartGroup(name);
	switch (name) {
		case "ipv6": // TODO
			throw new Error("Not implemented");
		default:
			return {
				init: (config: Config): void => {
					config.outbounds?.push({
						tag: smart.name,
						type: "urltest",
						outbounds: [],
						url: "https://cp.cloudflare.com",
					});
					const proxy = config.outbounds?.find(
						(o) => o.tag === OutboundTag.PROXY,
					) as OutboundSelector;
					proxy.outbounds.push(smart.name);
				},
				process: (
					config: Config,
					provider: Provider,
					outbound: Outbound,
				): void => {
					if (smart.filter(outbound.tag, provider)) {
						const group = config.outbounds?.find((o) => o.tag === smart.name);
						if (group?.type === "selector" || group?.type === "urltest")
							group.outbounds.push(outbound.tag);
					}
				},
			};
	}
}