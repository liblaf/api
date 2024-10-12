import type { OutboundShadowsocks } from '@sub/types/sing-box/outbound'
import { tryDecodeBase64 } from '@utils/base64'

// ref: <https://github.com/shadowsocks/shadowsocks-org/wiki/SIP002-URI-Scheme>
export function parseShadowsocks (uri: string): OutboundShadowsocks {
  const matchUri = uri.match(/ss:\/\/(?<body>[^\/\?#]+)(\/)?(#(?<tag>.+))?/)
  if (matchUri == null) throw new Error(`Invalid Shadowsocks URI: ${uri}`)
  let { body, tag } = matchUri.groups!
  body = tryDecodeBase64(body)
  const matchBody = body.match(
    /(?<userinfo>[^@]+)@(?<hostname>[^:]+):(?<port>\d+)/
  )
  if (matchBody == null) throw new Error(`Invalid Shadowsocks URI: ${uri}`)
  let { userinfo, hostname, port } = matchBody.groups!
  userinfo = tryDecodeBase64(userinfo)
  const matchUserinfo = userinfo.match(/(?<method>[^:]+):(?<password>.+)/)
  if (matchUserinfo == null) throw new Error(`Invalid Shadowsocks URI: ${uri}`)
  const { method, password } = matchUserinfo.groups!
  return {
    type: 'shadowsocks',
    tag: decodeURI(tag),
    server: hostname,
    server_port: Number.parseInt(port),
    method,
    password
  }
}
