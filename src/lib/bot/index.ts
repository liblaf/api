import { Bot } from "grammy";
import { UserInfo, fetchInfo } from "@/lib/sub/info";

type Env = {
  BOT_TOKEN: string;
  MY_CHAT_ID: string;
  MY_SUB_URLS: string;
};

export function newBot(env: Env) {
  const bot = new Bot(env.BOT_TOKEN);
  bot.command("getChatId", async (ctx) => {
    await ctx.reply(`\`${ctx.chat.id.toString()}\``);
  });
  bot.command("subInfo", async (ctx) => {
    if (ctx.chat.id.toString() !== env.MY_CHAT_ID) {
      await ctx.reply("🚫 Forbidden");
      return;
    }
    const urls: URL[] = env.MY_SUB_URLS.split("\n").map(
      (url: string) => new URL(url),
    );
    const info: UserInfo[] = await fetchInfo(urls);
    let message = info
      .map((i) => {
        let message = `[*${i.name}*](${i.url}):`;
        if (i.download && i.upload && i.total) {
          const usage = i.download + i.upload;
          const ratio = usage / i.total;
          const emoji = ratio < 0.6 ? "🟢" : ratio < 0.8 ? "🟡" : "🔴";
          message += ` ${emoji} ${prettyBytes(usage)} / ${prettyBytes(
            i.total,
          )}`;
        }
        if (i.expire) {
          const expire = new Date(i.expire * 1000);
          const remain = Date.now() - i.expire * 1000;
          const days = Math.floor(remain / 1000 / 86400);
          const emoji = days < 7 ? "🔴" : days < 14 ? "🟡" : "🟢";
          message += ` expire at ${prettyDate(expire)} ${emoji}`;
        }
        return message;
      })
      .join("\n");
    await ctx.reply(message, { parse_mode: "MarkdownV2" });
  });
  return bot;
}

function prettyBytes(bytes: number): string {
  return bytes.toLocaleString(undefined, {
    style: "unit",
    unit: "byte",
    maximumSignificantDigits: 3,
  });
}

function prettyDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
