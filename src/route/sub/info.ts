import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { BACKEND_URL } from "@/lib/sub/const";
import { fetchInfo, UserInfo, UserInfoSchema } from "@/lib/sub/info";

export const appSubInfo = new OpenAPIHono();

const querySchema = {
  backend: z.string().url().default(BACKEND_URL.toString()),
};

const responseSchema = z.object({
  info: z.array(UserInfoSchema),
});

appSubInfo.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Get subscription user info",
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
            schema: responseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const { backend, url } = c.req.valid("query");
    const info: UserInfo[] = await fetchInfo(
      url.map((url: string) => new URL(url)),
      new URL(backend)
    );
    return c.json({ info: info });
  }
);

appSubInfo.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Get my subscription info",
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
            schema: responseSchema,
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
    const { backend } = c.req.valid("query");
    const urls: URL[] = (c.env?.MY_URLS as string)
      .split("\n")
      .map((url: string) => new URL(url));
    const info: UserInfo[] = await fetchInfo(urls, new URL(backend));
    return c.json({ info: info });
  }
);
