import { fetchInfo } from "../info";
import { fetchSingBox } from "../sing-box/fetch";
import type { Provider } from "./abc";
import { common, subConvert, withSearchParams } from "./common";
import { COUNTRIES } from "./infer/country";

type Factory = {
	pattern: RegExp;
	make: (url: URL) => Partial<Provider>;
};

function fetchInfoWithSearchParams(url: URL, params: [string, string][]) {
	return async () => await fetchInfo(withSearchParams(url, params));
}

function fetchSingBoxWithSearchParams(url: URL, params: [string, string][]) {
	return async () => await fetchSingBox(withSearchParams(url, params));
}

const FACTORIES: Factory[] = [
	{
		pattern: /aca/,
		make: (url: URL) => ({
			name: "ACA",
			fetchUserInfo: fetchInfoWithSearchParams(url, [["flag", "clash"]]),
		}),
	},
	{
		pattern: /fldylink/,
		make: (url: URL) => ({
			name: "FastLink",
			fetchUserInfo: fetchInfoWithSearchParams(url, [
				["clash", "1"],
				["extend", "1"],
			]),
		}),
	},
	{
		pattern: /fbsublink/,
		make: (url) => ({
			name: "FlyingBird",
			fetchUserInfo: fetchInfoWithSearchParams(url, [
				["extend", "1"],
				["sub", "2"],
			]),
		}),
	},
	{
		pattern: /nthu/,
		make: (url: URL) => ({
			name: "NTHU.CC",
			fetchUserInfo: fetchInfoWithSearchParams(url, [["flag", "clash"]]),
		}),
	},
	{
		pattern: /cos.cat/,
		make: (url: URL) => ({
			name: "🏳️‍⚧️ 私房菜",
			fetchUserInfo: fetchInfoWithSearchParams(url, [["flag", "sing"]]),
			fetchSingBox: fetchSingBoxWithSearchParams(url, [["flag", "sing"]]),
		}),
	},
	{
		pattern: /jmssub.net/,
		make: (url: URL) => ({
			name: "JMS",
			fetchSingBox: async () => {
				const config = await fetchSingBox(subConvert(url, "singbox"));
				for (const outbound of config.outbounds ?? []) {
					const tag = outbound.tag;
					const match = tag.match(/@(?<name>[\w-]+)/);
					const name = match?.groups?.name;
					outbound.tag = name ?? tag;
				}
				return config;
			},
			country: (tag: string) => {
				if (tag.match(/s1|s2|s3/)) return COUNTRIES.US;
				if (tag.match(/s4/)) return COUNTRIES.JP;
				if (tag.match(/s5/)) return COUNTRIES.NL;
				if (tag.match(/s801/)) return COUNTRIES.OT;
				return COUNTRIES.OT;
			},
			rate: (tag: string) => 0,
		}),
	},
];

export function newProvider(url: URL): Provider {
	for (const { pattern, make } of FACTORIES) {
		if (pattern.test(url.hostname)) return { ...common(url), ...make(url) };
	}
	return common(url);
}
