import { getProfile } from "@/utils";
import type { Profile, SubscriptionUserinfo } from "@liblaf/sub-converter";
import { fetchAllInfo } from "@liblaf/sub-converter";
import { format } from "date-fns";
import type { CommandContext, Context } from "grammy";

export function sub(env: CloudflareBindings) {
  return async (ctx: CommandContext<Context>): Promise<void> => {
    const profile: Profile | undefined = await getProfile(
      env.KV_SUB,
      ctx.chat.id,
    );
    if (!profile) {
      await ctx.reply("🚫 Profile not found.");
      return;
    }
    const infos: SubscriptionUserinfo[] = await fetchAllInfo(profile.providers);
    const message: string = prettyInfo(infos);
    await ctx.reply(message, { parse_mode: "HTML" });
  };
}

function prettyInfo(info: SubscriptionUserinfo[]): string {
  const message: string = info
    .map((i: SubscriptionUserinfo): string => {
      let item = `<a href="${i.url}"><b>${i.name}</b></a>:`;
      if (i.download !== undefined && i.total !== undefined) {
        const usage: number = i.download + (i.upload || 0);
        const ratio: number = usage / i.total;
        const emoji = ratio < 0.6 ? "🟢" : ratio < 0.8 ? "🟡" : "🔴";
        item += ` ${emoji} ${prettyBytes(usage)} / ${prettyBytes(i.total)}`;
      }
      if (i.expire) {
        const expire = new Date(i.expire * 1000);
        const remain: number = i.expire * 1000 - Date.now();
        const days: number = Math.floor(remain / 86400000);
        const emoji = days < 7 ? "🔴" : days < 14 ? "🟡" : "🟢";
        item += ` ${emoji} ${format(expire, "yyyy-MM-dd")}`;
      }
      if (i.reset_day_of_month) item += ` 🔄 ${i.reset_day_of_month}`;
      if (i.reset_date) item += ` 🔄 ${i.reset_date}`;
      if (i.error) item += i.error;
      return item;
    })
    .join("\n");
  return message;
}

function prettyBytes(bytes: number, dp = 1): string {
  const THRESH = 1024;
  if (Math.abs(bytes) < THRESH) return `${bytes} B`;
  const UNITS = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;
  let size = bytes;
  do {
    size /= THRESH;
    ++u;
  } while (
    Math.round(Math.abs(size) * r) / r >= THRESH &&
    u < UNITS.length - 1
  );

  return `${size.toFixed(dp)} ${UNITS[u]}`;
}
