import { type Api, Bot, type Context, type RawApi } from "grammy";
import { help } from "./cmd/help";
import { id } from "./cmd/id";
import { start } from "./cmd/start";
import { sub } from "./cmd/sub";

export function createBot(env: CloudflareBindings): Bot<Context, Api<RawApi>> {
  const bot = new Bot(env.TG_BOT_TOKEN);
  bot.command("start", start);
  bot.command("help", help);
  bot.command("id", id);
  bot.command("sub", sub(env));
  return bot;
}
