import type { SubscriptionUserinfo } from '@sub/types/info'
import { fetchSubInfo } from './shared'

export async function fetchClashMeta (
  url: string,
  ua = 'sing-box'
): Promise<{ config: never, info: SubscriptionUserinfo }> {
  throw new Error('Not Implemented')
}

export async function fetchClashMetaInfo (
  url: string,
  ua = 'clash.meta'
): Promise<SubscriptionUserinfo> {
  return await fetchSubInfo(url, ua)
}
