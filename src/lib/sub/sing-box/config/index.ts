import type { Query } from "../query";
import { type DNS, defaultDNS } from "./dns";
import { type Experimental, defaultExperimental } from "./experimental";
import { type Inbound, defaultInbounds } from "./inbound";
import { type Log, defaultLog } from "./log";
import { type Outbound, defaultOutbounds } from "./outbound";
import { type Route, defaultRoute } from "./route";

export type Config = {
  log?: Log;
  dns?: DNS;
  inbounds?: Inbound[];
  outbounds?: Outbound[];
  route?: Route;
  experimental?: Experimental;
};

export function defaultConfig(query: Query): Required<Config> {
  return {
    log: defaultLog(query),
    dns: defaultDNS(query),
    inbounds: defaultInbounds(query),
    outbounds: defaultOutbounds(query),
    route: defaultRoute(query),
    experimental: defaultExperimental(query),
  };
}
