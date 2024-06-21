import { z } from "@hono/zod-openapi";
import { coerceBoolean, preprocessArray } from "@lib/zod-utils";
import { GROUPS } from "../group/shared";
import { COUNTRIES } from "../provider/infer/country";

export const QuerySchema = z.object({
  group: z
    .preprocess(
      preprocessArray,
      z.array(
        z.enum([
          "countries",
          ...Object.keys(GROUPS).map((k) => k.toLowerCase()),
          ...Object.keys(COUNTRIES).map((k) => k.toLowerCase()),
        ]),
      ),
    )
    .default(["auto", "ai", "emby", "media", "onedrive", "countries"]),
  mixed: coerceBoolean().default(true),
  port: z.coerce.number().int().min(0).max(65535).default(64393),
  tun: coerceBoolean().default(false),
});

export type Query = z.infer<typeof QuerySchema>;
