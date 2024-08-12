import { createRoute } from "@hono/zod-openapi";
import { createApp } from "@lib/app";
import { getConfig, getProviders } from "@lib/sub/kv";
import { SUBSCRIPTION_USER_INFO_SCHEMA } from "@lib/sub/provider/types";
import { QUERY_SCHEMA } from "@lib/sub/query";
import { generate } from "@lib/sub/sing-box/gen";
import { z } from "zod";

const app = createApp();

app.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Fetch subscription user info",
    method: "get",
    path: "/{id}/info",
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.array(
              z.object({
                name: z.string(),
                info: SUBSCRIPTION_USER_INFO_SCHEMA,
              }),
            ),
          },
        },
        description: "OK",
      },
      404: { description: "Not Found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const providers = await getProviders(c.env, id);
    if (!providers) return c.notFound();
    const info = await Promise.all(
      providers.map(async (provider) => {
        const info = await provider.fetchInfo();
        return { name: provider.name, info };
      }),
    );
    return c.json(info);
  },
);

app.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Download sing-box config",
    method: "get",
    path: "/{id}/sing-box",
    request: {
      params: z.object({ id: z.string() }),
      query: QUERY_SCHEMA,
    },
    responses: {
      200: {
        content: { "application/json": { schema: z.any() } },
        description: "OK",
      },
      404: {
        description: "Not Found",
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const queryRaw = c.req.valid("query");
    const { providers, query } = await getConfig(c.env, id, queryRaw);
    if (!providers) return c.notFound();
    const config = await generate(providers, query);
    return c.json(config);
  },
);

export default app;
