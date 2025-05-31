import { createRoute, z } from "@hono/zod-openapi";
import type { App } from "../utils";
import { env } from "hono/adapter";

export function mihomo(app: App): void {
  app.openapi(
    createRoute({
      method: "get",
      path: "/{uuid}/{filename}",
      request: {
        params: z.object({
          uuid: z
            .string()
            .openapi({ example: "00000000-0000-0000-0000-000000000000" }),
          filename: z.string().openapi({ example: "mihomo.yaml" }),
        }),
      },
      responses: {
        200: { description: "OK" },
        403: { description: "Forbidden" },
      },
    }),
    async (c) => {
      const { uuid, filename } = c.req.param();
      if (uuid !== env(c).UUID) return c.newResponse(null, 403);
      const data = await env(c).KV.get(filename);
      if (!data) return c.notFound();
      return c.text(data);
    },
  );
}
