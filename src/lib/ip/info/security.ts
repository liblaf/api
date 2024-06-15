import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";

export const SECURITY_SCHEMA = z.object({
	abuser: z.boolean().openapi({ example: true }),
	crawler: z.boolean().openapi({ example: false }),
	data_center: z.boolean().openapi({ example: true }),
	proxy: z.boolean().openapi({ example: false }),
	tor: z.boolean().openapi({ example: false }),
	vpn: z.boolean().openapi({ example: true }),
});

export type Security = z.infer<typeof SECURITY_SCHEMA>;

type SecurityRaw = {
	is_abuser: boolean;
	is_crawler: boolean;
	is_datacenter: boolean;
	is_proxy: boolean;
	is_tor: boolean;
	is_vpn: boolean;
};

export async function fetchSecurity(
	ip: string,
	key?: string,
): Promise<Security> {
	const url = new URL("https://api.ipapi.is");
	url.searchParams.set("q", ip);
	if (key) url.searchParams.set("key", key);
	const response = await fetchSafe(url);
	const data = (await response.json()) as SecurityRaw;
	return {
		abuser: data.is_abuser,
		crawler: data.is_crawler,
		data_center: data.is_datacenter,
		proxy: data.is_proxy,
		tor: data.is_tor,
		vpn: data.is_vpn,
	};
}
