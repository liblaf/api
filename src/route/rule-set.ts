import { createRoute } from "@hono/zod-openapi";
import { createApp } from "@lib/app";
import { fetchUnsafe } from "@lib/fetch";
import { z } from "zod";

const app = createApp();

app.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Rule Sets",
    method: "get",
    path: "/{type}/{filename}",
    request: {
      params: z.object({
        type: z.enum(["geoip", "geosite", "rule-set"]),
        filename: z.string(),
      }),
    },
    responses: {
      200: {
        content: {
          "application/octet-stream": {
            schema: z.any(),
          },
        },
        description: "OK",
      },
    },
  }),
  async (c) => {
    const { type, filename } = c.req.valid("param");
    const url = `https://github.com/liblaf/sing-box-rules/raw/rule-sets/${type}/${filename}`;
    const origin = await fetchUnsafe(url);
    return c.body(origin.body);
  },
);

export default app;
