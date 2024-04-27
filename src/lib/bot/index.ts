import { Bot } from "grammy";

export function newBot(token: string) {
  const bot = new Bot(token);
  bot.command("getChatId", (ctx) => {
    console.log(ctx);
    ctx.reply(ctx.chat.id.toString());
  });
  return bot;
}
