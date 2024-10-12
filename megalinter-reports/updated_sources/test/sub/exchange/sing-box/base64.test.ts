import { DUMMY_SUBSCRIPTIONS } from '@sub/dummy/const'
import { base64ToSingbox } from '@sub/exchange/sing-box'
import { expect, it } from 'vitest'

for (const [name, { base64, singbox }] of Object.entries(DUMMY_SUBSCRIPTIONS)) {
  if (!base64 || (singbox == null)) continue
  it(name, () => {
    const text = base64
    const node = base64ToSingbox(text).outbounds?.[0]
    expect(node).toStrictEqual(singbox)
  })
}
