import { base64ToSingbox, uriToSingbox } from '@sub/exchange/sing-box'
import { fetchBase64, fetchBase64Info } from '@sub/fetch/base64'
import { fetchClashMetaInfo } from '@sub/fetch/clash-meta'
import { JMSURL, fetchJMS, fetchJMSInfo } from '@sub/fetch/jms'
import { fetchSingbox, fetchSingboxInfo } from '@sub/fetch/sing-box'
import { fetchUri } from '@sub/fetch/uri'
import type { SubscriptionUserinfo } from '@sub/types/info'
import {
  PROVIDER_OPTIONS_SCHEMA,
  type ProviderOptions
} from '@sub/types/profile'
import type { Singbox } from '@sub/types/sing-box'
import { SingboxProvider } from './sing-box'

export class Airport {
  private readonly opts: ProviderOptions

  private readonly cache: {
    base64?: string
    info?: SubscriptionUserinfo
    singbox?: Singbox
    uri?: string[]
  } = {}

  constructor (opts: ProviderOptions) {
    this.opts = PROVIDER_OPTIONS_SCHEMA.parse(opts)
  }

  get name (): string {
    return this.opts.name
  }

  get url (): string {
    if (this.opts['sing-box']) return this.opts['sing-box'].url
    if (this.opts['clash.meta']) return this.opts['clash.meta'].url
    if (this.opts.base64) return this.opts.base64.url
    if (this.opts.uri) return this.opts.uri.url
    if (this.opts.jms) return JMSURL(this.opts.jms.service, this.opts.jms.id)
    throw new Error(`No URL for provider: ${this.name}.`)
  }

  async fetchSubInfo (): Promise<SubscriptionUserinfo> {
    if (this.cache.info) {
      // pass
    } else if (this.opts['sing-box']) {
      this.cache.info = await fetchSingboxInfo(
        this.opts['sing-box'].url,
        this.opts['sing-box'].ua
      )
    } else if (this.opts['clash.meta']) {
      this.cache.info = await fetchClashMetaInfo(
        this.opts['clash.meta'].url,
        this.opts['clash.meta'].ua
      )
    } else if (this.opts.base64) {
      this.cache.info = await fetchBase64Info(
        this.opts.base64.url,
        this.opts.base64.ua
      )
    } else if (this.opts.jms) {
      this.cache.info = await fetchJMSInfo(
        this.opts.jms.service,
        this.opts.jms.id
      )
    } else {
      this.cache.info = {}
    }
    return this.cache.info
  }

  async fetchSingbox (): Promise<SingboxProvider> {
    if (this.cache.singbox != null) {
      // pass
    } else if (this.opts['sing-box']) {
      const { config, info } = await fetchSingbox(
        this.opts['sing-box'].url,
        this.opts['sing-box'].ua
      )
      this.cache.singbox = config
      this.cache.info = info
    } else if (this.opts.base64) {
      if (!this.cache.base64) {
        this.cache.base64 = await fetchBase64(
          this.opts.base64.url,
          this.opts.base64.ua
        )
      }
      this.cache.singbox = base64ToSingbox(this.cache.base64)
    } else if (this.opts.uri) {
      if (this.cache.uri == null) {
        this.cache.uri = await fetchUri(this.opts.uri.url, this.opts.uri.ua)
      }
      this.cache.singbox = uriToSingbox(this.cache.uri)
    } else if (this.opts.jms) {
      if (!this.cache.base64) {
        this.cache.base64 = await fetchJMS(
          this.opts.jms.service,
          this.opts.jms.id
        )
      }
      this.cache.singbox = base64ToSingbox(this.cache.base64)
      for (const o of this.cache.singbox.outbounds ?? []) {
        const match = o.tag.match(/@(?<name>[\w-]+)/)
        if (match == null) continue
        o.tag = match.groups?.name ?? o.tag
        if (o.tag.match(/s1|s2|s3/) != null) o.tag = `🇺🇸 ${o.tag}`
        if (o.tag.match(/s4/) != null) o.tag = `🇯🇵 ${o.tag}`
        if (o.tag.match(/s5/) != null) o.tag = `🇳🇱 ${o.tag}`
      }
    } else {
      throw new Error()
    }
    return new SingboxProvider(this.name, this.cache.singbox)
  }
}
