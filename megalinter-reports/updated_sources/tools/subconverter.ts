import { fetchUnsafe } from '@utils/fetch'

const BACKENDS = {
  'FFQ官方后端【vless reality+hy1+hy2】': 'https://api.ytools.cc',
  '肥羊增强型后端【vless reality+hy1+hy2】': 'https://url.v1.mk',
  '肥羊备用后端【vless reality+hy1+hy2】': 'https://sub.d1.mk',
  'つつ-多地防失联【负载均衡+国内优化】': 'https://api.tsutsu.one',
  nameless13提供: 'https://www.nameless13.com',
  subconverter作者提供: 'https://sub.xeton.dev',
  'sub-web作者提供': 'https://api.wcc.best',
  'sub作者&lhie1提供': 'https://api.dler.io'
}

for (const [name, url] of Object.entries(BACKENDS)) {
  try {
    const resp = await fetchUnsafe(`${url}/version`)
    if (!resp.ok) throw new Error(resp.statusText)
    const version = (await resp.text()).trim()
    console.log(`[${name}](${url}): ${version}`)
  } catch (e) {
    console.log(`[${name}](${url}): ${e}`)
  }
}
