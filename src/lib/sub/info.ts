import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";
import { newProvider } from "./provider/factory";

export const UserInfoSchema = z.object({
	upload: z
		.number()
		.positive()
		.int()
		.optional()
		.openapi({ example: 10737418240 }),
	download: z
		.number()
		.positive()
		.int()
		.optional()
		.openapi({ example: 53687091200 }),
	total: z
		.number()
		.positive()
		.int()
		.optional()
		.openapi({ example: 107374182400 }),
	expire: z
		.number()
		.positive()
		.int()
		.optional()
		.describe("Unix timestamp")
		.openapi({ example: 1893427200 }),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

export async function fetchInfo(url: URL): Promise<UserInfo> {
	const response = await fetchSafe(url, { headers: { "User-Agent": "clash" } });
	const info: UserInfo = {};
	const header = response.headers.get("Subscription-UserInfo");
	if (header) {
		for (const item of header.split(";")) {
			const [key, value] = item.split("=").map((s) => s.trim());
			switch (key) {
				case "upload":
					info.upload = Number.parseInt(value);
					break;
				case "download":
					info.download = Number.parseInt(value);
					break;
				case "total":
					info.total = Number.parseInt(value);
					break;
				case "expire":
					info.expire = Number.parseInt(value);
					break;
			}
		}
	}
	return info;
}

export const InfoSchema = UserInfoSchema.extend({
	name: z.string().openapi({ example: "Nexitally" }),
	url: z.string().url().openapi({
		example:
			"https://sub.nexitally.com/api/v1/client/subscribe?token=5647ece2f4219be897d104764daa3afc",
	}),
	error: z.string().optional().openapi({ example: "error message" }),
});

export type Info = z.infer<typeof InfoSchema>;

export async function fetchInfoSafe(urls: URL[]): Promise<Info[]> {
	return Promise.all(
		urls.map(async (url: URL): Promise<Info> => {
			const provider = newProvider(url);
			try {
				const info = await provider.fetchUserInfo();
				return { name: provider.name, url: url.toString(), ...info };
			} catch (e) {
				if (e instanceof Error)
					return { name: provider.name, url: url.toString(), error: e.message };
				return { name: provider.name, url: url.toString(), error: String(e) };
			}
		}),
	);
}
