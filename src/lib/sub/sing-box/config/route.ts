import type { Query } from "../query";
import { type ClashMode, OUTBOUND_TAG, proxy } from "./shared";

export type Route = {
	rules?: RouteRule[];
	rule_set?: RuleSet[];
	final?: string;
	auto_detect_interface?: boolean;
};

type RouteRule = _RouteRule & {
	outbound: string;
};

type _RouteRule = RouteRuleDefault | RouteRuleLogical;

type RouteRuleDefault = {
	network?: ("tcp" | "udp")[];
	auth_user?: string[];
	protocol?: string[];
	domain_suffix?: string[];
	ip_is_private?: boolean;
	port?: number[];
	clash_mode?: ClashMode;
	rule_set?: string[];
};

type RouteRuleLogical = {
	type: "logical";
	mode: "and" | "or";
	rules: _RouteRule[];
};

type RuleSet = RuleSetRemote;

type RuleSetCommon = {
	type: string;
	tag: string;
	format: "source" | "binary";
};

type RuleSetRemote = RuleSetCommon & {
	type: "remote";
	url: string;
	download_detour?: string;
};

export function defaultRoute({ group }: Query): Route {
	return {
		rules: [
			{
				type: "logical",
				mode: "or",
				rules: [{ protocol: ["dns"] }, { port: [53] }],
				outbound: OUTBOUND_TAG.DNS,
			},
			{
				rule_set: ["geoip:private", "geosite:private"],
				ip_is_private: true,
				outbound: OUTBOUND_TAG.DIRECT,
			},
			{ rule_set: ["category:ads-all"], outbound: OUTBOUND_TAG.REJECT },
			{ clash_mode: "direct", outbound: OUTBOUND_TAG.DIRECT },
			{ clash_mode: "global", outbound: OUTBOUND_TAG.PROXY },
			{
				type: "logical",
				mode: "or",
				rules: [
					{ port: [853] },
					{ network: ["udp"], port: [443] },
					{ protocol: ["stun"] },
				],
				outbound: OUTBOUND_TAG.REJECT,
			},
			{ rule_set: ["category:ntp"], outbound: OUTBOUND_TAG.DIRECT },
			{ domain_suffix: ["byr.pt"], outbound: OUTBOUND_TAG.IPv6 },
			{ rule_set: ["geoip:cn", "geosite:cn"], outbound: OUTBOUND_TAG.DIRECT },
			{ rule_set: ["rule-set:ai"], outbound: OUTBOUND_TAG.AI },
			{ rule_set: ["rule-set:emby"], outbound: OUTBOUND_TAG.EMBY },
			{ rule_set: ["rule-set:media"], outbound: OUTBOUND_TAG.MEDIA },
			{
				rule_set: ["category:container", "geosite:onedrive"],
				outbound: OUTBOUND_TAG.ONEDRIVE,
			},
			{ rule_set: ["geoip:jp"], outbound: OUTBOUND_TAG.JP },
		],
		rule_set: [
			category("ads-all"),
			category("container"),
			category("ntp"),
			geoip("cn"),
			geoip("jp"),
			geoip("private"),
			geoip("telegram"),
			geosite("cn"),
			geosite("geolocation-!cn"),
			geosite("geolocation-cn"),
			geosite("onedrive"),
			geosite("private"),
			ruleSet("ai"),
			ruleSet("emby"),
			ruleSet("media"),
		],
		final: OUTBOUND_TAG.PROXY,
		auto_detect_interface: true,
	};
}

function geoip(tag: string): RuleSet {
	return remoteBinary(
		`geoip:${tag}`,
		`https://github.com/MetaCubeX/meta-rules-dat/raw/sing/geo/geoip/${tag}.json`,
	);
}

function geosite(tag: string): RuleSet {
	return remoteBinary(
		`geosite:${tag}`,
		`https://github.com/MetaCubeX/meta-rules-dat/raw/sing/geo/geosite/${tag}.json`,
	);
}

function category(tag: string): RuleSet {
	return remoteBinary(
		`category:${tag}`,
		`https://github.com/MetaCubeX/meta-rules-dat/raw/sing/geo/geosite/category-${tag}.json`,
	);
}

function ruleSet(tag: string): RuleSet {
	return remoteBinary(
		`rule-set:${tag}`,
		`https://github.com/liblaf/sing-box-rules/raw/rule-sets/${tag}.json`,
	);
}

function remoteBinary(tag: string, url: string): RuleSet {
	return {
		type: "remote",
		tag: tag,
		format: "binary",
		url: proxy(url),
		download_detour: OUTBOUND_TAG.DIRECT,
	};
}
