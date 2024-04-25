import { z } from "@hono/zod-openapi";

import { fetchSafe } from "@/lib/fetch";

export const RiskSchema = z.object({
  risk: z.number().positive().int().max(100).openapi({ example: 0 }),
});

export type Risk = z.infer<typeof RiskSchema>;

type RiskResponse = Record<string, { risk: number }>;

export async function fetchRisk(ip: string): Promise<Risk> {
  const response = await fetchSafe(`https://proxycheck.io/v2/${ip}?risk=2`);
  const data = (await response.json()) as RiskResponse;
  return {
    risk: data[ip].risk,
  };
}
