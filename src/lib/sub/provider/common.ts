import { BACKEND_URL } from "../const";
import { fetchInfo } from "../info";
import { fetchSingBox } from "../sing-box/fetch";
import type { Provider } from "./abc";
import { inferEmby, inferLimit } from "./infer/category";
import { inferCountry } from "./infer/country";
import { inferRate } from "./infer/rate";

export function common(url: URL): Provider {
	return {
		url: url,
		name: url.hostname,
		fetchUserInfo: async () => await fetchInfo(url),
		fetchSingBox: async () => await fetchSingBox(subConvert(url, "singbox")),
		country: inferCountry,
		isEmby: inferEmby,
		isLimit: inferLimit,
		rate: inferRate,
	};
}

export function subConvert(url: URL, target: string): URL {
	const result = new URL(BACKEND_URL);
	result.searchParams.set("target", target);
	result.searchParams.set("list", "true");
	result.search += `&url=${encodeURIComponent(url.toString())}`;
	return result;
}

export function withSearchParams(url: URL, params: [string, string][]): URL {
	const result = new URL(url);
	for (const [key, value] of params) {
		url.searchParams.set(key, value);
	}
	return result;
}
