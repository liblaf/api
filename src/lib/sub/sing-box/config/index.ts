import type { Params } from "../types";
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

export function createConfig(params: Params): SingBoxConfig {
  return {
    log: createConfigLog(params),
    dns: createConfigDNS(params),
    inbounds: createConfigInbounds(params),
    outbounds: createConfigOutbounds(params),
    route: createConfigRoute(params),
    experimental: createConfigExperimental(params),
  };
}
