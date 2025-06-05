import { createRoute, z } from "@hono/zod-openapi";
import { proxy } from "hono/proxy";
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
      return proxy(url, { redirect: "follow" });
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
      return await proxy(url, { redirect: "follow" });
    },
  );
}
