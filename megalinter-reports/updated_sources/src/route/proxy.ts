import { createApp } from '@utils/app'
import { fetchUnsafe } from '@utils/fetch'

const app = createApp()

app.all('/:url{.+}', async (c) => {
  let url = c.req.param('url')
  if (!url.match(/^https?:\/\//)) url = `https://${url}`
  const origin = await fetchUnsafe(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.raw.body,
    redirect: 'follow'
  })
  return new Response(origin.body, origin)
})

export default app
