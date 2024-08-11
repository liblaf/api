import { addDays, format } from "date-fns";
import type { SingBoxConfig } from "../sing-box/config";
import { convertSingBoxSubscription } from "./subconverter";
import type { SubscriptionUserInfo } from "./types";

export async function fetchClashSubscription(
  url: string,
  ua = "clash.meta",
): Promise<{ sub: SingBoxConfig; info?: SubscriptionUserInfo }> {
  return await convertSingBoxSubscription(url, ua);
}

export function parseSubscriptionUserInfo(
  header?: string | null,
  names?: string[],
): SubscriptionUserInfo {
  if (!header) return {};
  const res: SubscriptionUserInfo = {};
  for (const item of header.split(";")) {
    if (!item) continue;
    const pair = item.split("=");
    const key = pair[0].trim();
    const value = Number.parseInt(pair[1].trim());
    if (!Number.isNaN(value)) {
      switch (key) {
        case "upload":
          res.upload = value;
          break;
        case "download":
          res.download = value;
          break;
        case "total":
          res.total = value;
          break;
        case "expire":
          res.expire = value;
          break;
      }
    }
  }
  for (const name of names ?? []) {
    const match = name.match(/距离下次重置剩余：(?<days>\d+) 天/);
    if (match?.groups?.days) {
      const today = new Date();
      const date = addDays(today, Number.parseInt(match.groups.days));
      res.reset_date = format(date, "yyyy-MM-dd");
    }
  }
  return res;
}
