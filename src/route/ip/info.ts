import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { fetchGeo, GeoSchema } from "@/lib/ip/info/geo";
import { fetchRisk, RiskSchema } from "@/lib/ip/info/risk";
import { fetchSecurity, SecuritySchema } from "@/lib/ip/info/security";
import { coerceBoolean } from "@/lib/zod";

export const appIpInfo = new OpenAPIHono();

const QuerySchema = z.object({
  geo: coerceBoolean().default(true),
  risk: coerceBoolean().default(true),
  security: coerceBoolean().default(true),
});

type Query = z.infer<typeof QuerySchema>;

const ResponseSchema = z.object({
  ip: z.string().ip().openapi({ example: "8.8.8.8" }),
  geo: GeoSchema.optional(),
  risk: RiskSchema.optional(),
  security: SecuritySchema.optional(),
});

type Result = z.infer<typeof ResponseSchema>;

async function fetchResult(
  ip: string,
  { geo, risk, security }: Query
): Promise<Result> {
  const [geoData, riskData, securityData] = await Promise.all([
    geo ? fetchGeo(ip) : undefined,
    risk ? fetchRisk(ip) : undefined,
    security ? fetchSecurity(ip) : undefined,
  ]);
  return {
    ip,
    geo: geoData,
    risk: riskData,
    security: securityData,
  };
}

appIpInfo.openapi(
  createRoute({
    tags: ["IP"],
    summary: "Get info about client IP address",
    method: "get",
    path: "/",
    request: {
      query: QuerySchema,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const ip: string | undefined = c.req.header("X-Real-IP");
    if (!ip) throw new HTTPException(400, { message: "IP Not Found" });
    const query: Query = c.req.valid("query");
    const result: Result = await fetchResult(ip, query);
    return c.json(result);
  }
);

appIpInfo.openapi(
  createRoute({
    tags: ["IP"],
    summary: "Get IP info",
    method: "get",
    path: "/{ip}",
    request: {
      params: z.object({
        ip: z.string().ip().openapi({ example: "8.8.8.8" }),
      }),
      query: QuerySchema,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: ResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const { ip } = c.req.valid("param");
    const query: Query = c.req.valid("query");
    const result: Result = await fetchResult(ip, query);
    return c.json(result);
  }
);
