import type { SubscriptionUserinfo } from "@sub/types/info";
import { fetchUnsafe } from "@utils/fetch";
import { fetchSubInfo } from "./shared";

export async function fetchBase64(url: string, ua?: string): Promise<string> {
  const resp = await fetchUnsafe(
    url,
    ua ? { headers: { "User-Agent": ua } } : undefined,
  );
  return await resp.text();
}

export async function fetchBase64Info(
  url: string,
  ua = "clash.meta",
): Promise<SubscriptionUserinfo> {
  return await fetchSubInfo(url, ua);
}
