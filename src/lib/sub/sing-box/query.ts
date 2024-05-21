import { z } from "@hono/zod-openapi";

import { coerceBoolean } from "@lib/zod-utils";

export const QuerySchema = z.object({
  ipv6: coerceBoolean().default(false),
  mixed: coerceBoolean().default(true),
  port: z.coerce.number().int().min(0).max(65535).default(64393),
  tun: coerceBoolean().default(false),
});

export type Query = z.infer<typeof QuerySchema>;
