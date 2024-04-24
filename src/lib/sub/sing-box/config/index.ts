import { Query } from "../query";
import { DNS, defaultDNS } from "./dns";
import { Experimental, defaultExperimental } from "./experimental";
import { Inbound, defaultInbounds } from "./inbound";
import { Log, defaultLog } from "./log";
import { Outbound, defaultOutbounds } from "./outbound";
import { Route, defaultRoute } from "./route";

export type Config = {
  log?: Log;
  dns?: DNS;
  inbounds?: Inbound[];
  outbounds?: Outbound[];
  route?: Route;
  experimental?: Experimental;
};

export function defaultConfig(query: Query): Config {
  return {
    log: defaultLog(query),
    dns: defaultDNS(query),
    inbounds: defaultInbounds(query),
    outbounds: defaultOutbounds(query),
    route: defaultRoute(query),
    experimental: defaultExperimental(query),
  };
}
