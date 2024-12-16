import { createApp, fetchUnsafe } from "@/utils";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

const app = createApp();

const ASSETS: Record<string, string> = {
  "metacubexd.zip":
    "https://github.com/MetaCubeX/metacubexd/archive/gh-pages.zip",
};

app.openapi(
  createRoute({
    tags: ["Subscription"],
    method: "get",
    path: "/{filename}",
    summary: "Download Assets",
    request: {
      params: z.object({
        filename: z.enum(["metacubexd.zip"]),
      }),
    },
    responses: { 200: { description: "OK" } },
  }),
  async (c) => {
    const { filename } = c.req.valid("param");
    const url = ASSETS[filename];
    const origin = await fetchUnsafe(url, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
      redirect: "follow",
    });
    return new Response(origin.body, origin);
  },
);

export default app;
