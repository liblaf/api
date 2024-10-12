import type { CommandContext, Context } from 'grammy'

export async function start (ctx: CommandContext<Context>): Promise<void> {
  const name = ctx.chat.username ?? ctx.chat.id
  await ctx.reply(`Hello, ${name}!`)
}
