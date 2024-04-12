import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

export const appConvertSingBox = new OpenAPIHono();

appConvertSingBox.openapi(
  createRoute({
    summary: "Convert to sing-box (WIP)",
    method: "get",
    path: "/",
    request: {
      query: z.object({
        backend: z.string().default("https://api.ytools.cc/sub"),
        url: z.string(),
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
    },
  }),
  async (c) => {
    throw new HTTPException(501);
  }
);
