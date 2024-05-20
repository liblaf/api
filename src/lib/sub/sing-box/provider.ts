import { HTTPException } from "hono/http-exception";

import { fetchSafe } from "@lib/fetch";
import { makeProvider } from "@lib/sub/provider";
import { toSimplified } from "@lib/text";
import { Outbound } from "./config/outbound";
import { Query } from "./query";

const EXCLUDE_OUTBOUND_TYPES = new Set([
  "direct",
  "block",
  "dns",
  "selector",
  "urltest",
]);

export async function fetchOutbounds(
  sub: URL,
  { backend }: Query
): Promise<Outbound[]> {
  try {
    const provider = makeProvider(sub, new URL(backend));
    const response = await fetchSafe(provider.singBoxUrl);
    const data = (await response.json()) as any;
    let outbounds = data.outbounds as Outbound[];
    outbounds = outbounds.filter(
      (outbound) => !EXCLUDE_OUTBOUND_TYPES.has(outbound.type)
    );
    outbounds.forEach((outbound) => {
      const tag: string = toSimplified(outbound.tag);
      outbound.tag = `${tag} [${provider.name}]`;
    });
    return outbounds;
  } catch (err) {
    throw new HTTPException(err instanceof HTTPException ? err.status : 500, {
      message: `Failed to fetch "${sub}": ${err}`,
    });
  }
}
