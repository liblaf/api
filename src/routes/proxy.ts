import { createRoute, z } from "@hono/zod-openapi";
import type { Context } from "hono";
import type { App } from "../utils";

export function rules(app: App): void {
  app.openapi(
    createRoute({
      method: "get",
      path: "/rules/{platform}/{behavior}/{name}",
      request: {
        params: z.object({
          platform: z
            .enum(["mihomo", "sing-box"])
            .openapi({ example: "mihomo" }),
          behavior: z
            .enum(["domain", "ipcidr", "classical"])
            .openapi({ example: "domain" }),
          name: z.string().openapi({ example: "direct.txt" }),
        }),
      },
      responses: {
        200: { description: "OK" },
      },
    }),
    async (c) => {
      const { platform, behavior, name } = c.req.param();
      const url = `https://raw.githubusercontent.com/liblaf/sub-converter/refs/heads/main/rules/${platform}/${behavior}/${name}`;
      return await proxy(c, url);
    },
  );
}

export function icons(app: App): void {
  app.openapi(
    createRoute({
      method: "get",
      path: "/icons/{icon}",
      request: {
        params: z.object({
          icon: z.string().openapi({ example: "Proxy.png" }),
        }),
      },
      responses: {
        200: { description: "OK" },
      },
    }),
    async (c) => {
      const { icon } = c.req.param();
      const url = `https://raw.githubusercontent.com/Koolson/Qure/refs/heads/master/IconSet/Color/${icon}`;
      return await proxy(c, url);
    },
  );
}

async function proxy(c: Context, url: string): Promise<Response> {
  const resp = await fetch(url, { redirect: "follow" });
  return c.newResponse(resp.body, resp);
}
