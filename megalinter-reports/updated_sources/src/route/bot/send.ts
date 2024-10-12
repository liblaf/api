import { createBot } from '@bot/index'
import { createRoute } from '@hono/zod-openapi'
import { createApp } from '@utils/app'
import { z } from 'zod'

const app = createApp()

app.openapi(
  createRoute({
    tags: ['Bot'],
    method: 'post',
    path: '/{id}',
    summary: 'Send a message to chat',
    request: {
      params: z.object({ id: z.string().openapi({ example: '1111111111' }) }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              text: z.string().openapi({ example: 'Hello, world!' }),
              parse_mode: z.enum(['Markdown', 'MarkdownV2', 'HTML']).optional()
            })
          }
        }
      }
    },
    responses: { 200: { description: 'OK' } }
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { text, parse_mode } = c.req.valid('json')
    const bot = createBot(c.env)
    const response = await bot.api.sendMessage(id, text, {
      parse_mode
    })
    return c.json(response)
  }
)

const DNS_RECORD_ARRAY_SCHEMA = z
  .array(
    z.object({
      name: z.string().openapi({ example: 'example.com' }),
      content: z.string().openapi({ example: '1.1.1.1' })
    })
  )
  .default([])

app.openapi(
  createRoute({
    tags: ['Bot'],
    method: 'post',
    path: '/{id}/dns',
    summary: 'Send a DNS update message to chat',
    request: {
      params: z.object({ id: z.string().openapi({ example: '1111111111' }) }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              create: DNS_RECORD_ARRAY_SCHEMA,
              delete: DNS_RECORD_ARRAY_SCHEMA,
              keep: DNS_RECORD_ARRAY_SCHEMA
            })
          }
        }
      }
    },
    responses: { 200: { description: 'OK' } }
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { create, delete: del, keep } = c.req.valid('json')
    const bot = createBot(c.env)
    let text = ''
    for (const record of keep) { text += `🔵 <code>${record.name}</code> => <code>${record.content}</code>\n` }
    for (const record of del) { text += `🔴 <code>${record.name}</code> => <code>${record.content}</code>\n` }
    for (const record of create) { text += `🟢 <code>${record.name}</code> => <code>${record.content}</code>\n` }
    text = text.trim()
    const response = await bot.api.sendMessage(id, text, {
      parse_mode: 'HTML'
    })
    return c.json(response)
  }
)

export default app
