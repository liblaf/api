import { z } from "zod";

export const PROVIDER_OPTIONS_SCHEMA = z.object({
  name: z.string(),
  base64: z
    .object({
      url: z.string().url(),
      ua: z.string().optional(),
    })
    .optional(),
  "clash.meta": z
    .object({
      url: z.string().url(),
      ua: z.string().default("clash.meta"),
    })
    .optional(),
  jms: z
    .object({
      service: z.string(),
      id: z.string(),
    })
    .optional(),
  "sing-box": z
    .object({
      url: z.string().url(),
      ua: z.string().default("sing-box"),
    })
    .optional(),
  uri: z
    .object({
      url: z.string().url(),
      ua: z.string().optional(),
    })
    .optional(),
});

export type ProviderOptions = z.infer<typeof PROVIDER_OPTIONS_SCHEMA>;

export const PROFILE_OPTIONS_SCHEMA = z.object({
  providers: z.array(PROVIDER_OPTIONS_SCHEMA).default([]),
});

export type ProfileOptions = z.infer<typeof PROFILE_OPTIONS_SCHEMA>;
