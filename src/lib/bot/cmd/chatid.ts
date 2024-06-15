import type { CommandContext, Context } from "grammy";

export async function chatId(ctx: CommandContext<Context>): Promise<void> {
	await ctx.reply(`<code>${ctx.chat.id.toString()}</code>`, {
		parse_mode: "HTML",
	});
}
