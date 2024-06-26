import { createRoute, z } from "@hono/zod-openapi";
import { type Bindings, newApp } from "@lib/bindings";
import { GEO_SCHEMA, fetchGeo } from "@lib/ip/info/geo";
import { RISK_SCHEMA, fetchRisk } from "@lib/ip/info/risk";
import { SECURITY_SCHEMA, fetchSecurity } from "@lib/ip/info/security";
import { coerceBoolean } from "@lib/zod-utils";
import { HTTPException } from "hono/http-exception";

export const appIpInfo = newApp();

const QUERY_SCHEMA = z.object({
  geo: coerceBoolean().default(true),
  risk: coerceBoolean().default(true),
  security: coerceBoolean().default(true),
});

type Query = z.infer<typeof QUERY_SCHEMA>;

const RESPONSE_SCHEMA = z.object({
  ip: z.string().ip().openapi({ example: "8.8.8.8" }),
  geo: GEO_SCHEMA.optional(),
  risk: RISK_SCHEMA.optional(),
  security: SECURITY_SCHEMA.optional(),
});

type Result = z.infer<typeof RESPONSE_SCHEMA>;

async function fetchResult(
  ip: string,
  { geo, risk, security }: Query,
  env: Bindings,
): Promise<Result> {
  const [geoData, riskData, securityData] = await Promise.all([
    geo ? fetchGeo(ip) : undefined,
    risk ? fetchRisk(ip, env.PROXYCHECK_IO_KEY) : undefined,
    security ? fetchSecurity(ip, env.IPAPI_IS_KEY) : undefined,
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
      query: QUERY_SCHEMA,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: RESPONSE_SCHEMA,
          },
        },
      },
    },
  }),
  async (c) => {
    const ip = c.req.header("X-Real-IP");
    if (!ip) throw new HTTPException(400, { message: "IP Not Found" });
    const query = c.req.valid("query");
    const result = await fetchResult(ip, query, c.env);
    return c.json(result);
  },
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
      query: QUERY_SCHEMA,
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: RESPONSE_SCHEMA,
          },
        },
      },
    },
  }),
  async (c) => {
    const { ip } = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await fetchResult(ip, query, c.env);
    return c.json(result);
  },
);
