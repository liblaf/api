import type { CommandContext, Context } from 'grammy'

export async function id (ctx: CommandContext<Context>): Promise<void> {
  await ctx.reply(`<code>${ctx.chat.id}</code>`, { parse_mode: 'HTML' })
}
