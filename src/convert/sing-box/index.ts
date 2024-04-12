import { convert } from "@/lib/sing-box/convert";
import { Query } from "@/lib/sing-box/query";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

export const appConvertSingBox = new OpenAPIHono();

appConvertSingBox.openapi(
  createRoute({
    summary: "Convert to sing-box (WIP)",
    method: "get",
    path: "/",
    request: {
      query: z.object({
        backend: z.string().default("https://api.ytools.cc/sub"),
        listen_port: z.coerce.number().int().gte(0).lte(65535).default(64393),
        url: z.preprocess((val) => {
          return Array.isArray(val) ? val : [val];
        }, z.array(z.string().url())),
      }),
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.any({ description: "sing-box config" }),
          },
        },
      },
    },
  }),
  async (c) => {
    const query: Query = c.req.valid("query");
    const config = await convert(query);
    return c.json(config);
  },
);
