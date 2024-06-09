import type { Query } from "../query";
import { OUTBOUND_TAG } from "./shared";

export type Outbound =
	| OutboundDirect
	| OutboundBlock
	| OutboundDNS
	| OutboundSelector
	| OutboundURLTest;

type OutboundDirect = { type: "direct"; tag: string };

type OutboundBlock = { type: "block"; tag: string };

type OutboundDNS = { type: "dns"; tag: string };

export type OutboundSelector = {
	type: "selector";
	tag: string;
	outbounds: string[];
	default?: string;
};

export type OutboundURLTest = {
	type: "urltest";
	tag: string;
	outbounds: string[];
	url?: string;
};

export function defaultOutbounds(query: Query): Outbound[] {
	return [
		{
			type: "selector",
			tag: OUTBOUND_TAG.PROXY,
			outbounds: [],
		},
		{ type: "dns", tag: OUTBOUND_TAG.DNS },
		{ type: "direct", tag: OUTBOUND_TAG.DIRECT },
		{ type: "block", tag: OUTBOUND_TAG.REJECT },
	];
}
