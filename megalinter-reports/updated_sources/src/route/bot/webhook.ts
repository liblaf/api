import { createBot } from '@bot/index'
import { createRoute } from '@hono/zod-openapi'
import { createApp } from '@utils/app'
import { webhookCallback } from 'grammy'
import { z } from 'zod'

const app = createApp()

app.openapi(
  createRoute({
    tags: ['Bot'],
    method: 'get',
    path: '/',
    summary: 'Set Telegram bot webhook',
    responses: {
      200: {
        description: 'OK',
        content: {
          'text/plain': {
            schema: z
              .string()
              .url()
              .openapi({ example: 'https://api.liblaf.me/bot/webhook' })
          }
        }
      }
    }
  }),
  async (c) => {
    const bot = createBot(c.env)
    const url = c.req.url
    await bot.api.setWebhook(url)
    return c.text(url)
  }
)

app.openapi(
  createRoute({
    tags: ['Bot'],
    method: 'post',
    path: '/',
    summary: 'Telegram bot webhook',
    responses: {
      200: {
        description: 'OK'
      }
    }
  }),
  async (c) => {
    const bot = createBot(c.env)
    const callback = webhookCallback(bot, 'cloudflare-mod')
    const resp = await callback(c.req.raw)
    return resp
  }
)

export default app
