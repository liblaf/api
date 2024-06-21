import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";
import type { Provider } from "./provider/abc";
import { makeProvider } from "./provider/factory";

export const USER_INFO_SCHEMA = z.object({
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

export type UserInfo = z.infer<typeof USER_INFO_SCHEMA>;

export async function fetchInfoRaw(url: URL): Promise<UserInfo> {
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

export const INFO_SCHEMA = USER_INFO_SCHEMA.extend({
  name: z.string().openapi({ example: "Nexitally" }),
  url: z.string().url().openapi({
    example:
      "https://sub.nexitally.com/api/v1/client/subscribe?token=5647ece2f4219be897d104764daa3afc",
  }),
  error: z.string().optional().openapi({ example: "Error message" }),
});

export type Info = z.infer<typeof INFO_SCHEMA>;

export async function fetchInfoProvider(provider: Provider): Promise<Info> {
  try {
    const info = await provider.fetchUserInfo();
    return { name: provider.name, url: provider.url.toString(), ...info };
  } catch (e) {
    if (e instanceof Error)
      return {
        name: provider.name,
        url: provider.url.toString(),
        error: e.message,
      };
    return {
      name: provider.name,
      url: provider.url.toString(),
      error: String(e),
    };
  }
}

export async function fetchInfoUrl(url: URL): Promise<Info> {
  const provider = makeProvider(url);
  return fetchInfoProvider(provider);
}

export async function fetchInfoProviders(
  providers: Provider[],
): Promise<Info[]> {
  return Promise.all(providers.map(fetchInfoProvider));
}

export async function fetchInfoUrls(urls: URL[]): Promise<Info[]> {
  return Promise.all(urls.map(fetchInfoUrl));
}
