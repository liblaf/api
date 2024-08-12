import type { Query } from "../../query";
import { type DNS, createConfigDNS } from "./dns";
import { type Experimental, createConfigExperimental } from "./experimental";
import { type Inbound, createConfigInbounds } from "./inbound";
import { type Log, createConfigLog } from "./log";
import { type Outbound, createConfigOutbounds } from "./outbound";
import { type Route, createConfigRoute } from "./route";

export type SingBoxConfig = {
  log?: Log;
  dns?: DNS;
  // TODO: Add NTP fields
  inbounds: Inbound[];
  outbounds: Outbound[];
  route: Route;
  experimental?: Experimental;
};

export function createConfig(query: Query): SingBoxConfig {
  return {
    log: createConfigLog(query),
    dns: createConfigDNS(query),
    inbounds: createConfigInbounds(query),
    outbounds: createConfigOutbounds(query),
    route: createConfigRoute(query),
    experimental: createConfigExperimental(query),
  };
}
