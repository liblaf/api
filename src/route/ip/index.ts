import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { appIpInfo } from "./info";

export const appIp = new OpenAPIHono();

appIp.openapi(
  createRoute({
    tags: ["IP"],
    summary: "Get IP address",
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Return IP address",
        content: {
          "text/plain": {
            schema: z.string().ip().openapi({ example: "8.8.8.8" }),
          },
        },
      },
    },
  }),
  async (c) => {
    const ip = c.req.header("X-Real-IP");
    if (!ip) throw new HTTPException(400, { message: "IP Not Found" });
    return c.text(ip);
  }
);

appIp.route("/info", appIpInfo);
