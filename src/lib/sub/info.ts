import { z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

import { makeProvider } from "./provider";

export const UserInfoSchema = z.object({
  name: z.string().openapi({ example: "Nexitally" }),
  url: z.string().url().openapi({
    example:
      "https://sub.nexitally.com/api/v1/client/subscribe?token=5647ece2f4219be897d104764daa3afc",
  }),
  web_page_url: z
    .string()
    .url()
    .optional()
    .openapi({ example: "https://nexitally.com" }),
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

export async function fetchInfo(
  urls: URL[],
  backend: URL
): Promise<UserInfo[]> {
  return await Promise.all(urls.map((url) => fetchInfoOnce(url, backend)));
}

export async function fetchInfoOnce(url: URL, backend: URL): Promise<UserInfo> {
  const provider = makeProvider(url, backend);
  const response = await fetch(provider.userInfoUrl);
  if (!response.ok) {
    throw new HTTPException(response.status as StatusCode, {
      message: await response.text(),
    });
  }
  const info: UserInfo = {
    name: provider.name,
    url: provider.url.toString(),
  };
  const webPageUrl = response.headers.get("profile-web-page-url");
  if (webPageUrl) info.web_page_url = webPageUrl;
  const subscriptionUserInfo = response.headers.get("subscription-userinfo");
  if (subscriptionUserInfo) {
    subscriptionUserInfo.split(";").forEach((item) => {
      const [key, value] = item.split("=").map((s) => s.trim());
      switch (key) {
        case "upload":
          info.upload = parseInt(value);
          break;
        case "download":
          info.download = parseInt(value);
          break;
        case "total":
          info.total = parseInt(value);
          break;
        case "expire":
          info.expire = parseInt(value);
          break;
      }
    });
  }
  return info;
}
