import { OutboundTag } from '../const'
import type { SingboxQuery } from './query'
import type { DialFields } from './shared'

export type Outbound =
  | OutboundBase
  | OutboundDirect
  | OutboundBlock
  | OutboundShadowsocks
  | OutboundVmess
  | OutboundDNS
  | OutboundSelector
  | OutboundURLTest

export interface OutboundBase {
  type: string
  tag: string
}

// TODO: add more fields

type OutboundDirect = OutboundBase & DialFields & { type: 'direct' }

type OutboundBlock = OutboundBase & { type: 'block' }

export type OutboundShadowsocks = OutboundBase &
DialFields & {
  type: 'shadowsocks'
  server: string
  server_port: number
  method: string
  password: string
  // TODO: add more fields
}

export type OutboundVmess = OutboundBase &
DialFields & {
  type: 'vmess'
  server: string
  server_port: number
  uuid: string
  security?: string
  alter_id?: number
  // TODO: add more fields
}

type OutboundDNS = OutboundBase & { type: 'dns' }

export type OutboundSelector = OutboundBase & {
  type: 'selector'
  outbounds: string[]
  default?: string
  interrupt_exist_connections?: boolean
}

export type OutboundURLTest = OutboundBase & {
  type: 'urltest'
  outbounds: string[]
  url?: string
  interval?: string
  tolerance?: number
  idle_timeout?: string
  interrupt_exist_connections?: boolean
}

export function configOutbounds (query: SingboxQuery): Outbound[] {
  return [
    { type: 'direct', tag: OutboundTag.DIRECT },
    { type: 'block', tag: OutboundTag.REJECT },
    { type: 'dns', tag: OutboundTag.DNS }
  ]
}
