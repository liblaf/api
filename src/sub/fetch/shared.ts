import type { SubscriptionUserinfo } from "@sub/types/info";
import { fetchUnsafe } from "@utils/fetch";
import { addDays, format } from "date-fns";

export async function fetchSubInfo(
  url: string,
  ua = "clash.meta",
): Promise<SubscriptionUserinfo> {
  const resp = await fetchUnsafe(url, {
    method: "HEAD",
    headers: { "User-Agent": ua },
  });
  const header: string | null = resp.headers.get("Subscription-Userinfo");
  const info = parseSubInfo(header);
  return info;
}

export function parseSubInfo(
  header?: string | null,
  names?: string[],
): SubscriptionUserinfo {
  const info: SubscriptionUserinfo = {};
  if (header) Object.assign(info, parseHeader(header));
  if (names) Object.assign(info, parseNames(names));
  return info;
}

function parseHeader(header: string | null): SubscriptionUserinfo {
  const info: SubscriptionUserinfo = {};
  if (!header) return info;
  const items = header.split(";").map((item) => item.trim());
  for (const item of items) {
    if (!item) continue;
    const [key, value] = item.split("=").map((item) => item.trim());
    if (!(key && value)) continue;
    if (
      key === "upload" ||
      key === "download" ||
      key === "total" ||
      key === "expire"
    ) {
      info[key] = Number.parseInt(value);
    }
  }
  return info;
}

function parseNames(names: string[]): SubscriptionUserinfo {
  const info: SubscriptionUserinfo = {};
  for (const name of names) {
    const match = name.match(/距离下次重置剩余：(?<days>\d+) 天/);
    if (match?.groups?.days) {
      const today = new Date();
      const date = addDays(today, Number.parseInt(match.groups.days));
      info.reset_date = format(date, "yyyy-MM-dd");
    }
  }
  return info;
}
