import type { SingboxQuery } from '@sub/types/sing-box/query'

export enum Preset {
  LINUX = 'linux',
  IOS = 'ios',
  IOS_FULL = 'ios-full',
}

export const PRESETS: Record<Preset, Partial<SingboxQuery>> = {
  linux: {
    'in.mixed': true,
    'in.tun': false,
    platform: 'linux',
    group: ['auto', 'ai', 'download', 'emby', 'media', 'global', 'countries']
  },
  ios: {
    'in.mixed': false,
    'in.tun': true,
    platform: 'ios',
    group: ['balanced', 'emby', 'global']
  },
  'ios-full': {
    'in.mixed': false,
    'in.tun': true,
    platform: 'ios',
    group: ['auto', 'ai', 'download', 'emby', 'media', 'global', 'countries']
  }
}

export function applyPreset (query: SingboxQuery): SingboxQuery {
  if (query.preset) {
    return { ...query, ...PRESETS[query.preset] }
  }
  return query
}
