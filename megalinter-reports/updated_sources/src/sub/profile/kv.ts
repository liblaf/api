import type { ProfileOptions } from '@sub/types/profile'
import { Profile } from '.'

export async function getProfile (
  kv: KVNamespace,
  id: string
): Promise<Profile | null> {
  const opts = (await kv.get(id, 'json'))
  if (!opts) return null
  const profile = new Profile(opts)
  return profile
}
