import type { Bindings } from "@lib/app";
import { Bot } from "grammy";
import { chatId } from "./cmd/chatid";
import { sub } from "./cmd/sub";

export function newBot(env: Bindings) {
  const bot = new Bot(env.TG_BOT_TOKEN);
  bot.command("chatid", chatId);
  bot.command("sub", sub(env));
  return bot;
}
