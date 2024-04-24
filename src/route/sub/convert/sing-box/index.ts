import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { convert } from "@/lib/sub/sing-box/convert";
import { Query, QuerySchema } from "@/lib/sub/sing-box/query";

export const appSubConvertSingbox = new OpenAPIHono();

appSubConvertSingbox.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Convert subscription to sing-box",
    method: "get",
    path: "/",
    request: {
      query: QuerySchema.extend({
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
    const { url, ...query } = c.req.valid("query");
    const config = await convert(
      url.map((url) => new URL(url)),
      query
    );
    return c.json(config);
  }
);

appSubConvertSingbox.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Download my sing-box config",
    method: "get",
    path: "/{uuid}",
    request: {
      params: z.object({
        uuid: z.string().uuid(),
      }),
      query: QuerySchema,
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
      403: {
        description: "Forbidden",
      },
    },
  }),
  async (c) => {
    const { uuid } = c.req.valid("param");
    if (uuid !== c.env?.MY_UUID) throw new HTTPException(403);
    const urls: URL[] = (c.env?.MY_URLS as string)
      .split("\n")
      .map((url) => new URL(url));
    const query: Query = c.req.valid("query");
    const config = await convert(urls, query);
    return c.json(config);
  }
);
