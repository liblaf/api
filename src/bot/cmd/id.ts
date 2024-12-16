import type { CommandContext, Context } from "grammy";

export async function id(ctx: CommandContext<Context>): Promise<void> {
  // https://core.telegram.org/bots/api#html-style
  await ctx.reply(`<code>${ctx.chat.id}</code>`, { parse_mode: "HTML" });
}
