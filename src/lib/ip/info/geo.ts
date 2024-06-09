import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";

export const GeoSchema = z.object({
	asn: z.number().positive().int().openapi({ example: 15169 }),
	country: z.string().optional().openapi({ example: "United States" }),
	country_code: z.string().optional().openapi({ example: "US" }),
	country_flag: z.string().optional().openapi({ example: "🇺🇸" }),
	latitude: z
		.number()
		.min(-90.0)
		.max(+90.0)
		.optional()
		.openapi({ example: 37.751 }),
	longitude: z
		.number()
		.min(-180.0)
		.max(+180.0)
		.optional()
		.openapi({ example: -97.822 }),
	organization: z.string().openapi({ example: "Google" }),
});

export type Geo = z.infer<typeof GeoSchema>;

type GeoResponse = {
	asn: number;
	country?: string;
	country_code?: string;
	latitude?: number;
	longitude?: number;
	organization: string;
};

export async function fetchGeo(ip: string): Promise<Geo> {
	const response = await fetchSafe(`https://api.ip.sb/geoip/${ip}`);
	const data = (await response.json()) as GeoResponse;
	console.log(data);
	return {
		asn: data.asn,
		country: data.country,
		country_code: data.country_code,
		country_flag: data.country_code
			? countryCode2FlagEmoji(data.country_code)
			: undefined,
		latitude: data.latitude,
		longitude: data.longitude,
		organization: data.organization,
	};
}

function countryCode2FlagEmoji(countryCode: string): string {
	const codePoints: number[] = [...countryCode].map(
		(char: string): number => 127397 + char.charCodeAt(0),
	);
	return String.fromCodePoint(...codePoints);
}
