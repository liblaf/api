import type { Query } from "../query";
import { OutboundTag } from "./shared";

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
			tag: OutboundTag.PROXY,
			outbounds: [],
		},
		{ type: "dns", tag: OutboundTag.DNS },
		{ type: "direct", tag: OutboundTag.DIRECT },
		{ type: "block", tag: OutboundTag.REJECT },
	];
}
