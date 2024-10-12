import { Preset } from '@sub/gen/sing-box/preset'
import { coerce } from '@utils/zod'
import { z } from 'zod'

export const SINGBOX_QUERY_SCHEMA = z.object({
  'in.mixed': coerce(z.boolean()).default(true),
  'in.mixed.port': z.coerce.number().int().min(0).max(65535).default(2080),
  'in.tun': coerce(z.boolean()).default(false),
  group: coerce(z.array(z.string())).default([
    'auto',
    'ai',
    'download',
    'emby',
    'media',
    'countries',
    'global'
  ]),
  platform: z.enum(['linux', 'ios']).default('linux'),
  preset: z.enum([Preset.LINUX, Preset.IOS, Preset.IOS_FULL]).optional()
})

export type SingboxQuery = z.infer<typeof SINGBOX_QUERY_SCHEMA>
