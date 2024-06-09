import type { UserInfo } from "../info";
import type { Config as SingBoxConfig } from "../sing-box/config";

export type Provider = {
	name: string;
	url: URL;

	fetchUserInfo: () => Promise<UserInfo>;
	fetchSingBox: () => Promise<SingBoxConfig>;

	country: (tag: string) => string;
	isEmby: (tag: string) => boolean;
	isLimit: (tag: string) => boolean;
	rate: (tag: string) => number;
};
