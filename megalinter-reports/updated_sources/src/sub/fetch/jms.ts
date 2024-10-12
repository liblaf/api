import type { SubscriptionUserinfo } from '@sub/types/info'
import { fetchUnsafe } from '@utils/fetch'
import { z } from 'zod'
import { fetchBase64 } from './base64'

const GET_SUB = 'https://jmssub.net/members/getsub.php'
const GET_BW_COUNTER = 'https://justmysocks.net/members/getbwcounter.php'

export function JMSURL (service: string, id: string): string {
  const url = new URL(GET_SUB)
  url.searchParams.set('service', service)
  url.searchParams.set('id', id)
  return url.toString()
}

export async function fetchJMS (service: string, id: string): Promise<string> {
  const url = JMSURL(service, id)
  return await fetchBase64(url.toString())
}

const BW_COUNTER_SCHEMA = z.object({
  bw_counter_b: z.number().int(),
  bw_reset_day_of_month: z.number().int(),
  monthly_bw_limit_b: z.number().int()
})

type BWCounter = z.infer<typeof BW_COUNTER_SCHEMA>

export async function fetchJMSInfo (
  service: string,
  id: string
): Promise<SubscriptionUserinfo> {
  const url = new URL(GET_BW_COUNTER)
  url.searchParams.set('service', service)
  url.searchParams.set('id', id)
  try {
    const resp = await fetchUnsafe(url)
    const bwCounter: BWCounter = BW_COUNTER_SCHEMA.parse(await resp.json())
    return {
      upload: 0,
      download: bwCounter.bw_counter_b,
      total: bwCounter.monthly_bw_limit_b,
      reset_day_of_month: bwCounter.bw_reset_day_of_month
    }
  } catch (e) {
    console.error(`fetchUserInfo(): ${e}`)
    return {}
  }
}
