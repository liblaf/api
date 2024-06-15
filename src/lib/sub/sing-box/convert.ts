import { makeProvider } from "../provider/factory";
import { COUNTRIES } from "../provider/infer/country";
import { type Config, defaultConfig } from "./config";
import type { OutboundSelector } from "./config/outbound";
import { OUTBOUND_TAG } from "./config/shared";
import { makeSingBoxGroup } from "./group";
import type { Query } from "./query";

export async function convert(urls: URL[], query: Query): Promise<Config> {
	const config = defaultConfig(query);
	const providers = urls.map((url) => makeProvider(url));
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
		const outbounds = (await provider.fetchSingBox()).outbounds ?? [];
		for (const outbound of outbounds) {
			if (provider.isExcluded(outbound.tag)) continue;
			for (const g of groups) g.process(config, provider, outbound);
			outbound.tag = provider.rename(outbound.tag);
			config.outbounds.push(outbound);
		}
	}
	config.outbounds = config.outbounds.filter((outbound) => {
		if (outbound.type === "selector" || outbound.type === "urltest")
			return !!outbound.outbounds?.length;
		return true;
	});
	const proxy = config.outbounds.find(
		(outbound) => outbound.tag === OUTBOUND_TAG.PROXY,
	) as OutboundSelector;
	proxy.outbounds = proxy.outbounds.filter(
		(o) => !!config.outbounds.find((outbound) => o === outbound.tag),
	);
	config.route.rules = config.route.rules?.filter(
		(rule) =>
			!!config.outbounds.find((outbound) => rule.outbound === outbound.tag),
	);
	return config;
}
