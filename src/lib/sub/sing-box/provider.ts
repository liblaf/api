import { HTTPException } from "hono/http-exception";
import { toSimplified } from "@/lib/text";
import { Query } from "./query";
import { Outbound } from "./types/outbound";
import { makeProvider } from "../provider";

const EXCLUDE_OUTBOUND_TYPES = new Set([
  "direct",
  "block",
  "dns",
  "selector",
  "urltest",
]);

export async function fetchOutbounds(
  sub: URL,
  query: Query,
): Promise<Outbound[]> {
  try {
    const provider = makeProvider(sub, query.backend);
    const response = await fetch(provider.singBoxUrl);
    if (!response.ok) {
      throw new HTTPException(response.status as any, {
        message: await response.text(),
      });
    }
    const data = (await response.json()) as any;
    let outbounds = data.outbounds as Outbound[];
    outbounds = outbounds.filter(
      (outbound) => !EXCLUDE_OUTBOUND_TYPES.has(outbound.type),
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
