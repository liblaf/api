import { Profile } from "@sub/profile";
import type { SubscriptionUserinfo } from "@sub/types/info";
import type { ProfileOptions } from "@sub/types/profile";
import { format } from "date-fns";
import type { CommandContext, Context } from "grammy";

type Info = {
  name: string;
  url: string;
  info: SubscriptionUserinfo;
  error?: string;
};

export function sub(env: CloudflareBindings) {
  return async (ctx: CommandContext<Context>): Promise<void> => {
    const profileOpts = (await env.sub.get(
      ctx.chat.id.toString(),
      "json",
    )) as ProfileOptions;
    if (!profileOpts) {
      await ctx.reply("🚫 Profile not found.");
      return;
    }
    const profile = new Profile(profileOpts);
    const infos: Info[] = await profile.fetchSubInfo();
    const message: string = prettyInfo(infos);
    await ctx.reply(message, { parse_mode: "HTML" });
  };
}

function prettyInfo(info: Info[]): string {
  const message: string = info
    .map((i: Info): string => {
      let item = `<a href="${i.url}"><b>${i.name}</b></a>:`;
      if (i.info.download !== undefined && i.info.total !== undefined) {
        const usage: number = i.info.download + (i.info.upload || 0);
        const ratio: number = usage / i.info.total;
        const emoji = ratio < 0.6 ? "🟢" : ratio < 0.8 ? "🟡" : "🔴";
        item += ` ${emoji} ${prettyBytes(usage)} / ${prettyBytes(i.info.total)}`;
      }
      if (i.info.expire) {
        const expire = new Date(i.info.expire * 1000);
        const remain: number = i.info.expire * 1000 - Date.now();
        const days: number = Math.floor(remain / 86400000);
        const emoji = days < 7 ? "🔴" : days < 14 ? "🟡" : "🟢";
        item += ` ${emoji} ${format(expire, "yyyy-MM-dd")}`;
      }
      if (i.info.reset_day_of_month) item += ` 🔄 ${i.info.reset_day_of_month}`;
      if (i.info.reset_date) item += ` 🔄 ${i.info.reset_date}`;
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
