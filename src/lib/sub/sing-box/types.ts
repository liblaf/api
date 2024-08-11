import { coerceBoolean, preprocessArray } from "@lib/zod";
import { z } from "zod";
import { FLAGS } from "../filter/infer/country";
import {
  aiFilter,
  autoFilter,
  balancedFilter,
  downloadFilter,
  embyFilter,
  mediaFilter,
} from "../filter/smart";
import type { Filter } from "../filter/types";
import { OutboundTag } from "./config/const";

export type Group = {
  name: string;
  filter: Filter;
};

export const GROUPS: Record<string, Group> = {
  ai: { name: OutboundTag.AI, filter: aiFilter },
  auto: { name: OutboundTag.AUTO, filter: autoFilter },
  balanced: { name: OutboundTag.BALANCED, filter: balancedFilter },
  download: { name: OutboundTag.DOWNLOAD, filter: downloadFilter },
  emby: { name: OutboundTag.EMBY, filter: embyFilter },
  media: { name: OutboundTag.MEDIA, filter: mediaFilter },
};

export const PARAMS_SCHEMA = z.object({
  group: z.preprocess(
    preprocessArray,
    z
      .array(
        z.enum([
          "countries",
          ...Object.keys(GROUPS),
          ...Object.keys(FLAGS).map((s) => s.toLowerCase()),
        ]),
      )
      .default(["auto", "ai", "download", "emby", "media", "countries"]),
  ),
  mixed: coerceBoolean().default(true),
  port: z.coerce.number().int().min(0).max(65535).default(44393),
  tun: coerceBoolean().default(false),
});

export type Params = z.infer<typeof PARAMS_SCHEMA>;
