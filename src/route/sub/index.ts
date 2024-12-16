import { createApp } from "@/utils";
import { createRoute } from "@hono/zod-openapi";
import type { Profile, SubscriptionUserinfo } from "@liblaf/sub-converter";
import {
  PROFILE_SCHEMA,
  SUBSCRIPTION_USERINFO_SCHEMA,
  fetchAllInfo,
} from "@liblaf/sub-converter";
import type { Outbound } from "@liblaf/sub-converter/client/sing-box";
import {
  TEMPLATE_OPTIONS_SCHEMA,
  fetchSingboxProviders,
  getTemplateFactory,
  sanitize,
} from "@liblaf/sub-converter/client/sing-box";
import { z } from "zod";

const app = createApp();

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
              results: z.array(SUBSCRIPTION_USERINFO_SCHEMA),
            }),
          },
        },
      },
      404: { description: "Not Found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const profile: Profile | undefined = await getProfile(c.env.KV_SUB, id);
    if (!profile) return await c.notFound();
    const results: SubscriptionUserinfo[] = await fetchAllInfo(
      profile.providers,
    );
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
      query: TEMPLATE_OPTIONS_SCHEMA.extend({
        preset: z.enum(["default", "ios"]).default("default"),
      }),
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
    const profile: Profile | undefined = await getProfile(c.env.KV_SUB, id);
    if (!profile) return await c.notFound();
    const providers: Map<string, Outbound[]> = await fetchSingboxProviders(
      profile.providers,
    );
    const template = getTemplateFactory(query.preset);
    const cfg = sanitize(template(providers, query));
    return c.json(cfg);
  },
);

async function getProfile(
  kv: KVNamespace,
  id: string,
): Promise<Profile | undefined> {
  const raw = await kv.get(id, "json");
  if (!raw) return;
  const profile: Profile = PROFILE_SCHEMA.parse(raw);
  return profile;
}

export default app;
