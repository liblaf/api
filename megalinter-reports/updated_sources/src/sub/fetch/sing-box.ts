import type { SubscriptionUserinfo } from '@sub/types/info'
import type { Singbox } from '@sub/types/sing-box'
import { fetchSubInfo, parseSubInfo } from './shared'

export async function fetchSingbox (
  url: string,
  ua = 'sing-box'
): Promise<{ config: Singbox, info: SubscriptionUserinfo }> {
  const resp = await fetch(url, { headers: { 'User-Agent': ua } })
  const config = (await resp.json()) as Singbox
  const info = parseSubInfo(
    resp.headers.get('Subscription-Userinfo'),
    config.outbounds?.map((o) => o.tag)
  )
  return { config, info }
}

export async function fetchSingboxInfo (
  url: string,
  ua = 'sing-box'
): Promise<SubscriptionUserinfo> {
  return await fetchSubInfo(url, ua)
}
