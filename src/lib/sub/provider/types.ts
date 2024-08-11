import { z } from "zod";

export const SUBSCRIPTION_USER_INFO_SCHEMA = z.object({
  upload: z.number().int().optional(),
  download: z.number().int().optional(),
  total: z.number().int().optional(),
  expire: z.number().int().optional(),
  reset_day_of_month: z.number().int().optional(),
  reset_date: z.string().date().optional(),
});

export type SubscriptionUserInfo = z.infer<
  typeof SUBSCRIPTION_USER_INFO_SCHEMA
>;
