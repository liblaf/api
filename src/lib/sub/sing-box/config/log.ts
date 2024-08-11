import type { Params } from "../types";

export type Log = {
  disabled?: boolean;
  level?: "trace" | "debug" | "info" | "warn" | "error" | "fatal" | "panic";
  output?: string;
  timestamp?: boolean;
};

export function createConfigLog(params: Params): Log {
  return {
    disabled: false,
    level: "warn",
  };
}
