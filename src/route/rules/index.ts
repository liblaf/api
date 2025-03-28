import { createApp, fetchUnsafe } from "@/utils";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const app = createApp();

app.openapi(
  createRoute({
    tags: ["Subscription"],
    method: "get",
    path: "/{client}/{type}/{filename}",
    summary: "Download Rules",
    request: {
      params: z.object({
        client: z.enum(["sing"]),
        type: z.enum(["rule-set", "geoip", "geosite"]),
        filename: z.string(),
      }),
    },
    responses: { 200: { description: "OK" } },
  }),
  async (c) => {
    const { client, type, filename } = c.req.valid("param");
    const url = `https://github.com/liblaf/sing-box-rules/raw/${client}/${type}/${filename}`;
    const origin = await fetchUnsafe(url);
    return origin;
  },
);

export default app;
