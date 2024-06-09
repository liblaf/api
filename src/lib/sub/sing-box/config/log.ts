import type { Query } from "../query";

export type Log = {
	disabled?: boolean;
	level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "panic";
	output?: string;
	timestamp?: boolean;
};

export function defaultLog(query: Query): Log {
	return {
		disabled: false,
		level: "warn",
		timestamp: false,
	};
}
