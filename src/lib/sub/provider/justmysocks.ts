import { fetchUnsafe } from "@lib/fetch";
import type { SingBoxConfig } from "../sing-box/config";
import { convertSingBoxSubscription } from "./subconverter";
import type { SubscriptionUserInfo } from "./types";

const GET_SUB = "https://jmssub.net/members/getsub.php";
const GET_BW_COUNTER = "https://justmysocks.net/members/getbwcounter.php";

type BWCounter = {
  bw_counter_b: number;
  bw_reset_day_of_month: number;
  monthly_bw_limit_b: number;
};

export async function fetchJMSSubscription(
  service: string,
  id: string,
): Promise<{ sub: SingBoxConfig; info?: SubscriptionUserInfo }> {
  return {
    sub: await fetchSubscription(service, id),
    info: await fetchUserInfo(service, id),
  };
}

export function jmsURL(service: string, id: string): string {
  const url = new URL(GET_SUB);
  url.searchParams.set("service", service);
  url.searchParams.set("id", id);
  return url.toString();
}

async function fetchSubscription(
  service: string,
  id: string,
): Promise<SingBoxConfig> {
  const url = jmsURL(service, id);
  const { sub } = await convertSingBoxSubscription(url);
  for (const o of sub.outbounds) {
    const match = o.tag.match(/@(?<name>[\w-]+)/);
    if (match) {
      o.tag = match.groups?.name ?? o.tag;
      if (o.tag.match(/s1|s2|s3/)) o.tag = `🇺🇸 ${o.tag}`;
      if (o.tag.match(/s4/)) o.tag = `🇯🇵 ${o.tag}`;
      if (o.tag.match(/s5/)) o.tag = `🇳🇱 ${o.tag}`;
    }
  }
  return sub;
}

async function fetchUserInfo(
  service: string,
  id: string,
): Promise<SubscriptionUserInfo | undefined> {
  const url = new URL(GET_BW_COUNTER);
  url.searchParams.set("service", service);
  url.searchParams.set("id", id);
  try {
    const resp = await fetchUnsafe(url);
    const bwCounter = (await resp.json()) as BWCounter;
    return {
      upload: 0,
      download: bwCounter.bw_counter_b,
      total: bwCounter.monthly_bw_limit_b,
      reset_day_of_month: bwCounter.bw_reset_day_of_month, // TODO: calculate expire date
    };
  } catch (e) {
    console.error(`fetchUserInfo(): ${e}`);
    return undefined;
  }
}
