import { BACKEND_URL } from "../const";
import { type UserInfo, fetchInfoRaw } from "../info";
import type { Config as SingBoxConfig } from "../sing-box/config";
import { fetchSingBox } from "../sing-box/fetch";
import { inferEmby, inferExcluded, inferLimit } from "./infer/category";
import { inferCountry } from "./infer/country";
import { inferRate } from "./infer/rate";

export type Provider = {
	name: string;
	url: URL;

	fetchUserInfo: () => Promise<UserInfo>;
	fetchSingBox: () => Promise<SingBoxConfig>;
	rename: (name: string) => string;

	isExcluded: (name: string) => boolean;
	country: (name: string) => string;
	isEmby: (name: string) => boolean;
	isLimit: (name: string) => boolean;
	rate: (name: string) => number;
};

export type ProviderOptions = Pick<Provider, "url"> & Partial<Provider>;

export function newProvider(options: ProviderOptions): Provider {
	return {
		name: options.url.hostname,
		fetchUserInfo: async () => await fetchInfoRaw(options.url),
		fetchSingBox: async () =>
			await fetchSingBox(subConvert(options.url, "singbox")),
		rename: (name: string) => `${name} [${options.name}]`,

		isExcluded: inferExcluded,
		country: inferCountry,
		isEmby: inferEmby,
		isLimit: inferLimit,
		rate: inferRate,

		...options,
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

export function fetchInfoWithSearchParams(
	url: URL,
	params: [string, string][],
): () => Promise<UserInfo> {
	return async () => await fetchInfoRaw(withSearchParams(url, params));
}

export function fetchSingBoxWithSearchParams(
	url: URL,
	params: [string, string][],
): () => Promise<SingBoxConfig> {
	return async () => await fetchSingBox(withSearchParams(url, params));
}
