import { fetchSingBox } from "../sing-box/fetch";
import {
	type Provider,
	type ProviderOptions,
	fetchInfoWithSearchParams,
	fetchSingBoxWithSearchParams,
	newProvider,
	subConvert,
} from "./abc";
import { COUNTRIES } from "./infer/country";

type Factory = {
	pattern: RegExp;
	make: (url: URL) => Omit<ProviderOptions, "url">;
};

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
					const origin = outbound.tag;
					const match = origin.match(/@(?<name>[\w-]+)/);
					const name = match?.groups?.name;
					outbound.tag = origin ?? origin;
				}
				return config;
			},
			country: (name: string) => {
				if (name.match(/s1|s2|s3/)) return COUNTRIES.US;
				if (name.match(/s4/)) return COUNTRIES.JP;
				if (name.match(/s5/)) return COUNTRIES.NL;
				if (name.match(/s801/)) return COUNTRIES.OT;
				return COUNTRIES.OT;
			},
			rate: (name: string) => 0,
		}),
	},
];

export function makeProvider(url: URL): Provider {
	for (const { pattern, make } of FACTORIES) {
		if (pattern.test(url.hostname))
			return newProvider({ url: url, ...make(url) });
	}
	return newProvider({ url: url });
}
