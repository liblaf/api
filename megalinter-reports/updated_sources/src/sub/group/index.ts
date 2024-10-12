import { OutboundTag } from '@sub/types/const'
import { FLAGS } from './filter/infer/country'
import {
  aiFilter,
  autoFilter,
  balancedFilter,
  createCountryFilter,
  downloadFilter,
  embyFilter,
  globalFilter,
  mediaFilter
} from './filter/smart'
import type { Filter } from './filter/types'

export interface Group {
  name: string
  type: 'selector' | 'urltest'
  filter: Filter
}

const GROUPS: Record<string, Group> = {
  ai: { name: OutboundTag.AI, type: 'urltest', filter: aiFilter },
  auto: { name: OutboundTag.AUTO, type: 'urltest', filter: autoFilter },
  balanced: {
    name: OutboundTag.BALANCED,
    type: 'urltest',
    filter: balancedFilter
  },
  download: {
    name: OutboundTag.DOWNLOAD,
    type: 'urltest',
    filter: downloadFilter
  },
  emby: { name: OutboundTag.EMBY, type: 'urltest', filter: embyFilter },
  global: { name: OutboundTag.GLOBAL, type: 'selector', filter: globalFilter },
  media: { name: OutboundTag.MEDIA, type: 'urltest', filter: mediaFilter }
}

export function createGroups (names: string[]): Group[] {
  const groups: Group[] = []
  for (const name of names) {
    if (name === 'countries') {
      for (const country of Object.keys(FLAGS)) {
        groups.push({
          name: FLAGS[country],
          type: 'urltest',
          filter: createCountryFilter(country)
        })
      }
    } else if (name in GROUPS) {
      groups.push(GROUPS[name])
    } else if (name in FLAGS) {
      groups.push({
        name: FLAGS[name.toUpperCase()],
        type: 'urltest',
        filter: createCountryFilter(name)
      })
    }
  }
  return groups
}
