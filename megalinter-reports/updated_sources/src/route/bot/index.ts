import { createApp } from '@utils/app'
import appSend from './send'
import appWebhook from './webhook'

const app = createApp()
app.route('/send', appSend)
app.route('/webhook', appWebhook)

export default app
