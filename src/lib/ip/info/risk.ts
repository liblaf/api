import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";

export const RiskSchema = z.object({
  risk: z.number().positive().int().max(100).openapi({ example: 0 }),
});

export type Risk = z.infer<typeof RiskSchema>;

type RiskResponse = Record<string, { risk: number }>;

export async function fetchRisk(ip: string, key?: string): Promise<Risk> {
  const url = new URL(`https://proxycheck.io/v2/${ip}`);
  url.searchParams.set("risk", "2");
  if (key) url.searchParams.set("key", key);
  const response = await fetchSafe(url);
  const data = (await response.json()) as RiskResponse;
  return {
    risk: data[ip].risk,
  };
}
