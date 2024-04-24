import { z } from "@hono/zod-openapi";

export const SecuritySchema = z.object({
  abuser: z.boolean().openapi({ example: true }),
  crawler: z.boolean().openapi({ example: false }),
  data_center: z.boolean().openapi({ example: true }),
  proxy: z.boolean().openapi({ example: false }),
  tor: z.boolean().openapi({ example: false }),
  vpn: z.boolean().openapi({ example: true }),
});

export type Security = z.infer<typeof SecuritySchema>;

type SecurityResponse = {
  is_abuser: boolean;
  is_crawler: boolean;
  is_datacenter: boolean;
  is_proxy: boolean;
  is_tor: boolean;
  is_vpn: boolean;
};

export async function fetchSecurity(ip: string): Promise<Security> {
  const response = await fetch(`https://api.ipapi.is?q=${ip}`);
  const data = (await response.json()) as SecurityResponse;
  return {
    abuser: data.is_abuser,
    crawler: data.is_crawler,
    data_center: data.is_datacenter,
    proxy: data.is_proxy,
    tor: data.is_tor,
    vpn: data.is_vpn,
  };
}
