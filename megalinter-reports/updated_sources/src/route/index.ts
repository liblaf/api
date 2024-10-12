import { createApp } from '@utils/app'
import HTML from '@utils/swagger'
import { HTTPException } from 'hono/http-exception'
import appBot from './bot'
import appProxy from './proxy'
import appRules from './rules'
import appSub from './sub'

const app = createApp()

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: { title: "liblaf's API", version: 'v0' },
  externalDocs: { description: 'GitHub', url: 'https://github.com/liblaf/api' }
})

app.onError(async (err, c) => {
  console.error(err)
  if (err instanceof HTTPException) return err.getResponse()
  return c.text(`${err}`, 500, { 'X-Error': `${err}` })
})

app.get('/', async (c) => c.html(HTML))
app.route('/bot', appBot)
app.route('/proxy', appProxy)
app.route('/rules', appRules)
app.route('/sub', appSub)

export default app
