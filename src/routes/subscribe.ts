import type { OpenAPIRouteSchema } from "chanfana";
import { Obj, OpenAPIRoute, Str, Uuid } from "chanfana";
import { env } from "hono/adapter";
import type { Context } from "../types";

export class RouteSubscribe extends OpenAPIRoute {
  override schema: OpenAPIRouteSchema = {
    request: {
      params: Obj({
        filename: Str({ example: "mihomo.yaml" }),
      }),
      query: Obj({
        id: Uuid({ example: "00000000-0000-0000-0000-000000000000" }),
      }),
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "text/plain": {
            schema: Str(),
          },
        },
      },
      404: { description: "Not Found" },
    },
  };

  override async handle(c: Context): Promise<Response> {
    const { filename } = c.req.param();
    const { id } = c.req.query();
    const data: string | null = await env(c).KV.get(`${id}/${filename}`);
    if (!data) return c.notFound();
    return c.text(data);
  }
}
