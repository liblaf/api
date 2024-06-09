import { newProvider } from "../provider/factory";
import { COUNTRIES } from "../provider/infer/country";
import { type Config, defaultConfig } from "./config";
import type { OutboundSelector } from "./config/outbound";
import { OutboundTag } from "./config/shared";
import { makeSingBoxGroup } from "./group";
import type { Query } from "./query";

export async function convert(urls: URL[], query: Query): Promise<Config> {
	const config = defaultConfig(query);
	const providers = urls.map((url: URL) => newProvider(url));
	const groups = [];
	for (const g of query.group) {
		switch (g) {
			case "countries":
				for (const country in COUNTRIES) groups.push(makeSingBoxGroup(country));
				break;
			default:
				groups.push(makeSingBoxGroup(g));
		}
	}
	for (const g of groups) g.init(config);
	for (const provider of providers) {
		try {
			const outbounds = (await provider.fetchSingBox()).outbounds ?? [];
			for (const outbound of outbounds) {
				config.outbounds.push(outbound);
				for (const g of groups) {
					g.process(config, provider, outbound);
				}
			}
		} catch (e) {}
	}
	config.outbounds = config.outbounds.filter((outbound) => {
		if (outbound.type === "selector" || outbound.type === "urltest")
			return outbound.outbounds?.length !== 0;
		return true;
	});
	const proxy = config.outbounds.find(
		(outbound) => outbound.tag === OutboundTag.PROXY,
	) as OutboundSelector;
	proxy.outbounds = proxy.outbounds.filter((o) => {
		return (
			config.outbounds.find((outbound) => o === outbound.tag) !== undefined
		);
	});
	config.route.rules = config.route.rules?.filter((rule) => {
		return (
			config.outbounds.find((outbound) => rule.outbound === outbound.tag) !==
			undefined
		);
	});
	return config;
}
