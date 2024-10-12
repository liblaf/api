import type { CommandContext, Context } from 'grammy'

export async function help (ctx: CommandContext<Context>): Promise<void> {
  const name = ctx.chat.username ?? ctx.chat.id
  await ctx.reply(
    `Hello, ${name}! I'm <a href="https://github.com/liblaf/api">liblaf</a>'s bot. Here are some commands you can use:

/start - Start the bot
/help - Show this help message
/id - Get your chat ID
/sub - Get your subscription info`,
    { parse_mode: 'HTML' }
  )
}
