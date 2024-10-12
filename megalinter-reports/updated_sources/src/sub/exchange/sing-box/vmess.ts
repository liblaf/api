import type { OutboundVmess } from '@sub/types/sing-box/outbound'
import { decodeBase64 } from '@utils/base64'
import { z } from 'zod'

// ref: <https://github.com/2dust/v2rayN/wiki/%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AF%B4%E6%98%8E(ver-2)>
const VMESS_SCHEMA = z.object({
  v: z.coerce.number().optional(), // 配置文件版本号, 主要用来识别当前配置
  ps: z.string(), // 备注或别名
  add: z.string(), // 地址 IP 或域名
  port: z.coerce.number(), // 端口号
  id: z.string().uuid(), // UUID
  aid: z.number(), // alterId
  scy: z.string().optional(), // 加密方式 (security), 没有时值默认 auto
  net: z.string().optional(), // 传输协议 (tcp\kcp\ws\h2\quic)
  type: z.string().optional(), // 伪装类型 (none\http\srtp\utp\wechat-video) *tcp or kcp or QUIC
  host: z.string().optional(), // 伪装的域名
  path: z.string().optional(), // path
  tls: z.string().optional(), // 传输层安全 (tls)
  sni: z.string().optional(), // serverName
  alpn: z.string().optional(), // h2,http/1.1
  fp: z.string().optional() // fingerprint
})

type Vmess = z.infer<typeof VMESS_SCHEMA>

export function parseVmess (uri: string): OutboundVmess {
  if (!uri.startsWith('vmess://')) throw new Error(`Invalid Vmess URI: ${uri}`)
  const data = uri.replace('vmess://', '')
  const json: Vmess = VMESS_SCHEMA.parse(JSON.parse(decodeBase64(data)))
  return {
    type: 'vmess',
    tag: json.ps,
    server: json.add,
    server_port: json.port,
    uuid: json.id,
    alter_id: json.aid,
    security: 'auto'
  }
}
