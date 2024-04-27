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
    await ctx.reply(JSON.stringify(info));
  });
  return bot;
}
