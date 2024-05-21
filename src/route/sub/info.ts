import { createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { UserInfoSchema } from "@lib/sub/info";
import { newApp } from "@lib/bindings";
import { newProvider } from "@lib/sub/provider/factory";

export const appSubInfo = newApp();

const InfoSchema = z
  .object({
    name: z.string(),
    url: z.string().url(),
    error: z.string().optional(),
  })
  .merge(UserInfoSchema);

type Info = z.infer<typeof InfoSchema>;

const responseSchema = z.object({
  info: z.array(InfoSchema),
});

appSubInfo.openapi(
  createRoute({
    tags: ["Subscription"],
    summary: "Get subscription user info",
    method: "get",
    path: "/",
    request: {
      query: z.object({
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
    const { url } = c.req.valid("query");
    const info: Info[] = await fetchInfo(
      url.map((url: string) => new URL(url)),
    );
    return c.json({ info: info });
  },
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
    if (uuid !== c.env.MY_UUID) throw new HTTPException(403);
    const urls: URL[] = c.env.MY_SUB_URLS.split("\n").map(
      (url: string) => new URL(url),
    );
    const info: Info[] = await fetchInfo(urls);
    return c.json({ info: info });
  },
);

async function fetchInfo(urls: URL[]): Promise<Info[]> {
  return Promise.all(
    urls.map(async (url: URL): Promise<Info> => {
      const provider = newProvider(url);
      try {
        const info = await provider.fetchUserInfo();
        return { name: provider.name, url: url.toString(), ...info };
      } catch (e) {
        if (e instanceof Error)
          return { name: provider.name, url: url.toString(), error: e.message };
        return { name: provider.name, url: url.toString(), error: String(e) };
      }
    }),
  );
}
