import type { SingBoxConfig } from "../sing-box/config";
import { fetchSingBoxSubscription } from "./sing-box";
import type { SubscriptionUserInfo } from "./types";

const BACKEND = "https://url.v1.mk/sub";

export async function convertSingBoxSubscription(
  url: string,
  ua = "clash.meta",
): Promise<{ sub: SingBoxConfig; info?: SubscriptionUserInfo }> {
  const req = new URL(BACKEND);
  req.searchParams.set("target", "singbox");
  req.searchParams.set("list", "true");
  req.search += `&url=${encodeURIComponent(url)}`;
  const { sub, info } = await fetchSingBoxSubscription(req.toString(), ua);
  return { sub, info };
}
