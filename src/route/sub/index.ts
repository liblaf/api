import { createRoute } from "@hono/zod-openapi";
import { genSingbox } from "@sub/gen/sing-box";
import { getProfile } from "@sub/profile/kv";
import { SUBSCRIPTION_USERINFO_SCHEMA } from "@sub/types/info";
import { SINGBOX_QUERY_SCHEMA } from "@sub/types/sing-box/query";
import { createApp } from "@utils/app";
import { z } from "zod";
import appDummy from "./dummy";

const app = createApp();

app.route("/dummy", appDummy);

app.openapi(
  createRoute({
    tags: ["Subscription"],
    method: "get",
    path: "/{id}/info",
    summary: "Get subscription user info",
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.object({
              results: z.array(
                z.object({
                  name: z.string(),
                  info: SUBSCRIPTION_USERINFO_SCHEMA,
                }),
              ),
            }),
          },
        },
      },
      404: { description: "Not Found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const profile = await getProfile(c.env.sub, id);
    if (!profile) return await c.notFound();
    const results = await profile.fetchSubInfo();
    return c.json({ results });
  },
);

app.openapi(
  createRoute({
    tags: ["Subscription"],
    method: "get",
    path: "/{id}/sing-box",
    summary: "Get subscription sing-box config",
    request: {
      params: z.object({ id: z.string() }),
      query: SINGBOX_QUERY_SCHEMA,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: z.any(),
          },
        },
      },
      404: { description: "Not Found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const query = c.req.valid("query");
    const profile = await getProfile(c.env.sub, id);
    if (!profile) return await c.notFound();
    const providers = await profile.fetchSingbox();
    const config = genSingbox(providers, query);
    return c.json(config);
  },
);

export default app;
