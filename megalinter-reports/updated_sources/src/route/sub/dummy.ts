import { createRoute } from '@hono/zod-openapi'
import { DUMMY_SUBSCRIPTIONS } from '@sub/dummy/const'
import type { Singbox } from '@sub/types/sing-box'
import { createApp } from '@utils/app'
import { z } from 'zod'

const app = createApp()

app.openapi(
  createRoute({
    tags: ['Subscription'],
    method: 'get',
    path: '/{type}/{name}',
    summary: 'Get dummy subscription',
    request: {
      params: z.object({
        type: z.enum(['base64', 'uri', 'singbox']),
        name: z.string()
      })
    },
    responses: { 200: { description: 'OK' } }
  }),
  async (c) => {
    const { type: t, name } = c.req.valid('param')
    const dummy = DUMMY_SUBSCRIPTIONS[name]
    if (!dummy) return c.notFound()
    const data = dummy[t]
    if (!data) return c.notFound()
    switch (t) {
      case 'base64':
      case 'uri':
        return c.text(data as string)
      case 'singbox':
        return c.json({ outbounds: [data] } as Singbox)
    }
  }
)

export default app
