import { createRoute, z } from "@hono/zod-openapi";
import { env } from "hono/adapter";
import type { App } from "../utils";

export function mihomo(app: App): void {
  app.openapi(
    createRoute({
      method: "get",
      path: "/subscribe/{filename}",
      request: {
        params: z.object({
          filename: z
            .string()
            .openapi({ examples: ["mihomo.yaml", "sing-box.json"] }),
        }),
        query: z.object({
          id: z
            .string()
            .uuid()
            .openapi({ example: "00000000-0000-0000-0000-000000000000" }),
        }),
      },
      responses: {
        200: { description: "OK" },
        403: { description: "Forbidden" },
        404: { description: "Not Found" },
      },
    }),
    async (c) => {
      const { filename } = c.req.param();
      const { id } = c.req.query();
      if (id !== env(c).UUID) return c.newResponse(null, 403);
      const data = await env(c).KV.get(filename);
      if (!data) return c.notFound();
      return c.text(data);
    },
  );
}
