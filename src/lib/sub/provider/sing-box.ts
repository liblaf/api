import { fetchUnsafe } from "@lib/fetch";
import type { SingBoxConfig } from "../sing-box/config";
import { parseSubscriptionUserInfo } from "./clash";
import type { SubscriptionUserInfo } from "./types";

const EXCLUDE_OUTBOUND_TYPES = new Set([
  "direct",
  "block",
  "dns",
  "selector",
  "urltest",
]);

export async function fetchSingBoxSubscription(
  url: string,
  ua = "sing-box",
): Promise<{ sub: SingBoxConfig; info?: SubscriptionUserInfo }> {
  const resp = await fetchUnsafe(url, { headers: { "user-agent": ua } });
  const header = resp.headers.get("subscription-userinfo");
  const config = (await resp.json()) as SingBoxConfig;
  config.outbounds = config.outbounds.filter(
    (o) => !EXCLUDE_OUTBOUND_TYPES.has(o.type),
  );
  if (config.outbounds.length === 0)
    throw new Error(`No valid outbounds in subscription: ${url}`);
  return {
    sub: config,
    info: parseSubscriptionUserInfo(
      header,
      config.outbounds.map((o) => o.tag),
    ),
  };
}
