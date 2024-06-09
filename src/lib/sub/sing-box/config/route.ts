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
			{ rule_set: ["geosite:category-ads-all"], outbound: OUTBOUND_TAG.REJECT },
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
			{ rule_set: ["geosite:category-ntp"], outbound: OUTBOUND_TAG.DIRECT },
			{ domain_suffix: ["byr.pt"], outbound: OUTBOUND_TAG.IPv6 },
			{ rule_set: ["geosite:ai"], outbound: OUTBOUND_TAG.AI },
			{ rule_set: ["geosite:emby"], outbound: OUTBOUND_TAG.EMBY },
			{ rule_set: ["geosite:onedrive"], outbound: OUTBOUND_TAG.ONEDRIVE },
			{ rule_set: ["geoip:jp"], outbound: OUTBOUND_TAG.JP },
			{ rule_set: ["geosite:proxy"], outbound: OUTBOUND_TAG.PROXY },
			{ rule_set: ["geoip:cn", "geosite:cn"], outbound: OUTBOUND_TAG.DIRECT },
		],
		rule_set: [
			geoip("cn"),
			geoip("jp"),
			geoip("private"),
			geosite("category-ads-all"),
			geosite("category-ntp"),
			geosite("private"),
			remoteBinary(
				"geosite:ai",
				"https://github.com/liblaf/sing-box-rules/raw/rule-sets/ai.srs",
			),
			remoteBinary(
				"geosite:cn",
				"https://github.com/liblaf/sing-box-rules/raw/rule-sets/cn.srs",
			),
			remoteBinary(
				"geosite:emby",
				"https://github.com/liblaf/sing-box-rules/raw/rule-sets/emby.srs",
			),
			remoteBinary(
				"geosite:onedrive",
				"https://github.com/liblaf/sing-box-rules/raw/rule-sets/onedrive.srs",
			),
			remoteBinary(
				"geosite:proxy",
				"https://github.com/liblaf/sing-box-rules/raw/rule-sets/proxy.srs",
			),
		],
		final: OUTBOUND_TAG.PROXY,
		auto_detect_interface: true,
	};
}

function geoip(tag: string): RuleSet {
	return remoteBinary(
		`geoip:${tag}`,
		`https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geoip/${tag}.srs`,
	);
}

function geosite(tag: string): RuleSet {
	return remoteBinary(
		`geosite:${tag}`,
		`https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo/geosite/${tag}.srs`,
	);
}

function geositeLite(tag: string): RuleSet {
	return remoteBinary(
		`geosite-lite:${tag}`,
		`https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/sing/geo-lite/geosite/${tag}.srs`,
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
