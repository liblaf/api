import type { Profile } from "@liblaf/sub-converter";
import { PROFILE_SCHEMA } from "@liblaf/sub-converter";

export async function getProfile(
  kv: KVNamespace,
  id: number | string,
): Promise<Profile | undefined> {
  const raw = await kv.get(id.toString(), "json");
  if (!raw) return undefined;
  return PROFILE_SCHEMA.parse(raw);
}
