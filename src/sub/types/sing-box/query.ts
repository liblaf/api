import { coerce } from "@utils/zod";
import { z } from "zod";

export const SINGBOX_QUERY_SCHEMA = z.object({
  "inbound.mixed": coerce(z.boolean()).default(true),
  "inbound.mixed.port": z.coerce.number().int().min(0).max(65535).default(2080),
  "inbound.tun": coerce(z.boolean()).default(false),
  group: coerce(z.array(z.string())).default([
    "auto",
    "ai",
    "download",
    "emby",
    "media",
    "countries",
    "global",
  ]),
  platform: z.enum(["linux", "ios"]).default("linux"),
});

export type SingboxQuery = z.infer<typeof SINGBOX_QUERY_SCHEMA>;
