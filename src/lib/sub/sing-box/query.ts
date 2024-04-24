import { z } from "@hono/zod-openapi";

import { BACKEND_URL } from "@/lib/sub/const";
import { coerceBoolean } from "@/lib/zod";

export const QuerySchema = z.object({
  backend: z.string().url().default(BACKEND_URL.toString()),
  ipv6: coerceBoolean().default(true),
  listen_port: z.coerce.number().int().min(0).max(65535).default(64393),
  mixed: coerceBoolean().default(true),
  tun: coerceBoolean().default(false),
});

export type Query = z.infer<typeof QuerySchema>;
