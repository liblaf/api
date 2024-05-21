import { z } from "@hono/zod-openapi";
import { fetchSafe } from "@lib/fetch";

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
    header.split(";").forEach((item) => {
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
