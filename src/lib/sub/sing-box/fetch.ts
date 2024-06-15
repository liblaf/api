import { fetchSafe } from "@lib/fetch";
import type { Config } from "./config";

const OUTBOUND_TYPE_EXCLUDE = new Set([
	"direct",
	"block",
	"dns",
	"selector",
	"urltest",
]);

const cache = new Map<string, Config>();

export async function fetchSingBox(url: URL): Promise<Config> {
	if (cache.has(url.toString())) {
		return cache.get(url.toString()) as Config;
	}
	const response = await fetchSafe(url, {
		headers: { "User-Agent": "sing-box" },
	});
	const config = (await response.json()) as Config;
	config.outbounds = config.outbounds?.filter(
		(outbound) => !OUTBOUND_TYPE_EXCLUDE.has(outbound.type),
	);
	cache.set(url.toString(), config);
	return config;
}
