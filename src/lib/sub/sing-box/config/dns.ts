import type { Query } from "../query";
import { type ClashMode, OUTBOUND_TAG } from "./shared";

export type DNS = {
	servers?: DNSServer[];
	rules?: DNSRule[];
	final?: string;
	independent_cache?: boolean;
	client_subnet?: string;
	fakeip?: FakeIP;
};

export type DNSServer = {
	tag: string;
	address: string;
	address_resolver?: string;
	address_strategy?: string;
	detour?: string;
	client_subnet?: string;
};

export type DNSRule = _DNSRule & {
	server: string;
	disable_cache?: boolean;
	rewrite_ttl?: number;
	client_subnet?: string;
};

type _DNSRule = DNSRuleDefault | DNSRuleLogical;

type DNSRuleDefault = {
	query_type?: (number | string)[];
	clash_mode?: ClashMode;
	rule_set?: string[];
	invert?: boolean;
	outbound?: "any" | string[];
};

type DNSRuleLogical = {
	type: "logical";
	mode: "and" | "or";
	rules: _DNSRule[];
};

type FakeIP = {
	enabled?: boolean;
	inet4_range?: string;
	inet6_range?: string;
};

export function defaultDNS({ tun }: Query): DNS {
	const dns: DNS = {
		servers: [
			{
				tag: DNS_TAG.CLOUDFLARE,
				address: "https://cloudflare-dns.com/dns-query",
				address_resolver: DNS_TAG.LOCAL,
			},
			{ tag: DNS_TAG.LOCAL, address: "local", detour: OUTBOUND_TAG.DIRECT },
			{ tag: DNS_TAG.REJECT, address: "rcode://success" },
			...(tun ? [{ tag: DNS_TAG.FAKEIP, address: "fakeip" }] : []),
		],
		rules: [
			{ rule_set: ["geosite:private"], server: DNS_TAG.LOCAL },
			{ outbound: "any", server: DNS_TAG.LOCAL },
			{
				rule_set: ["category:ads-all"],
				server: DNS_TAG.REJECT,
				disable_cache: true,
			},
			{ clash_mode: "direct", server: DNS_TAG.LOCAL },
			{ clash_mode: "global", server: DNS_TAG.CLOUDFLARE },
			...(tun
				? [
						{
							query_type: ["A", "AAAA"],
							server: DNS_TAG.FAKEIP,
							rewrite_ttl: 1,
						},
					]
				: []),
			{ rule_set: ["category:ntp"], server: DNS_TAG.LOCAL },
			{ rule_set: ["geosite:geolocation-cn"], server: DNS_TAG.LOCAL },
			{
				type: "logical",
				mode: "and",
				rules: [
					{ rule_set: ["geosite:geolocation-!cn"], invert: true },
					{ rule_set: ["geoip:cn"] },
				],
				server: DNS_TAG.CLOUDFLARE,
				client_subnet: "101.6.6.6",
			},
		],
		final: DNS_TAG.CLOUDFLARE,
		independent_cache: true,
		...(tun
			? {
					fakeip: {
						enabled: true,
						inet4_range: "198.18.0.0/15",
						inet6_range: "fc00::/18",
					},
				}
			: {}),
	};
	return dns;
}

const DNS_TAG = {
	CLOUDFLARE: "dns:cloudflare",
	LOCAL: "dns:local",
	REJECT: "dns:reject",
	FAKEIP: "dns:fakeip",
};
