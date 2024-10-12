import type { Filter } from '@sub/group/filter/types'
import type { Singbox } from '@sub/types/sing-box'
import type { Outbound } from '@sub/types/sing-box/outbound'

const EXCLUDE_OUTBOUND_TYPES = new Set([
  'direct',
  'block',
  'dns',
  'selector',
  'urltest'
])

export class SingboxProvider {
  constructor (
    readonly name: string,
    readonly config: Singbox
  ) {}

  nodes (...filters: Filter[]): Outbound[] {
    let nodes = this.config.outbounds ?? []
    nodes = nodes.filter((o) => !EXCLUDE_OUTBOUND_TYPES.has(o.type))
    for (const f of filters) nodes = nodes.filter((o) => f(o.tag))
    nodes = JSON.parse(JSON.stringify(nodes)) // clone
    for (const o of nodes) o.tag += ` [${this.name}]`
    return nodes
  }

  nodeNames (...filters: Filter[]): string[] {
    const outbounds = this.nodes(...filters)
    return outbounds.map((o) => o.tag)
  }
}
