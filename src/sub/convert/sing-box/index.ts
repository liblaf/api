import { BACKEND_URL } from "@/lib/sub/const";
import { convert } from "@/lib/sub/sing-box/convert";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

export const appSubConvertSingbox = new OpenAPIHono();

function preprocessBoolean(val: any): any {
  const str: string = String(val).toLowerCase();

  if (str === "1") return true;
  if (str === "true") return true;
  if (str === "y") return true;
  if (str === "yes") return true;

  if (str === "0") return false;
  if (str === "false") return false;
  if (str === "n") return false;
  if (str === "no") return false;

  return val;
}

const querySchema = {
  backend: z.string().url().default(BACKEND_URL.toString()),
  listen_port: z.coerce.number().int().gte(0).lte(65535).default(64393),
  mixed: z.preprocess(preprocessBoolean, z.boolean().default(true)),
  tun: z.preprocess(preprocessBoolean, z.boolean().default(false)),
};

appSubConvertSingbox.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Convert subscription to sing-box",
    method: "get",
    path: "/",
    request: {
      query: z.object({
        ...querySchema,
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
    const queryRaw = c.req.valid("query");
    const query = {
      ...queryRaw,
      backend: new URL(queryRaw.backend),
      url: queryRaw.url.map((url: string) => new URL(url)),
    };
    const config = await convert(query);
    return c.json(config);
  },
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
      query: z.object({
        ...querySchema,
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
      403: {
        description: "Forbidden",
      },
    },
  }),
  async (c) => {
    const { uuid } = c.req.valid("param");
    if (uuid !== c.env?.MY_UUID) throw new HTTPException(403);
    const url: URL[] = (c.env?.MY_URLS as string)
      .split("\n")
      .map((url) => new URL(url));
    const queryRaw = c.req.valid("query");
    const query = {
      ...queryRaw,
      backend: new URL(queryRaw.backend),
      url: url,
    };
    const config = await convert(query);
    return c.json(config);
  },
);
