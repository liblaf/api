import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "../utils";

export function rules(app: App): void {
  app.openapi(
    createRoute({
      method: "get",
      path: "/rules/{platform}/{behavior}/{name}",
      request: {
        params: z.object({
          platform: z.enum(["mihomo", "sing-box"]),
          behavior: z.enum(["domain", "ipcidr", "classical"]),
          name: z.string(),
        }),
      },
      responses: {
        200: { description: "OK" },
      },
    }),
    async (c) => {
      const { platform, behavior, name } = c.req.param();
      const url = `https://raw.githubusercontent.com/liblaf/sub-converter/refs/heads/main/rules/${platform}/${behavior}/${name}`;
      const resp = await fetch(url, { redirect: "follow" });
      return c.newResponse(resp.body, resp);
    },
  );
}
