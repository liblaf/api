import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

export const appIpInfo = new OpenAPIHono();

const querySchema = z.object({
  geo: z.coerce.boolean(),
  risk: z.coerce.boolean(),
  security: z.coerce.boolean(),
});

const responseSchema = z.object({
  ip: z.string().ip(),
  geo: z
    .object({
      asn: z.number().positive().int().openapi({ example: 15169 }),
      country: z.string().optional().openapi({ example: "United States" }),
      country_code: z.string().optional().openapi({ example: "US" }),
      country_flag: z.string().optional().openapi({ example: "🇺🇸" }),
      organization: z.string().openapi({ example: "Google" }),
    })
    .optional(),
  risk: z
    .object({
      risk: z.number().int().gte(0).lte(100).openapi({ example: 0 }),
    })
    .optional(),
  security: z
    .object({
      abuser: z.boolean().openapi({ example: true }),
      crawler: z.boolean().openapi({ example: false }),
      data_center: z.boolean().openapi({ example: true }),
      proxy: z.boolean().openapi({ example: false }),
      tor: z.boolean().openapi({ example: false }),
      vpn: z.boolean().openapi({ example: true }),
    })
    .optional(),
});

type Geo = {
  asn: number;
  country_code?: string;
  country_flag?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  organization: string;
};

type Risk = {
  risk: number;
};

type Security = {
  abuser: boolean;
  crawler: boolean;
  data_center: boolean;
  proxy: boolean;
  tor: boolean;
  vpn: boolean;
};

type IpInfo = {
  ip: string;
  geo?: Geo;
  risk?: Risk;
  security?: Security;
};

appIpInfo.openapi(
  createRoute({
    summary: "Get IP info",
    method: "get",
    path: "/",
    request: {
      query: querySchema,
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
    const ip: string | undefined = c.req.header("X-Real-IP");
    if (!ip) {
      throw new HTTPException(400, { message: "IP Not Found" });
    }
    const { geo, risk, security } = c.req.valid("query");
    const promises: Promise<IpInfo>[] = [];
    if (geo) {
      promises.push(getGeo(ip));
    }
    if (risk) {
      promises.push(getRisk(ip));
    }
    if (security) {
      promises.push(getSecurity(ip));
    }
    const results: IpInfo[] = await Promise.all(promises);
    return c.json(Object.assign({ ip: ip }, ...results));
  }
);

appIpInfo.openapi(
  createRoute({
    summary: "Get IP info",
    method: "get",
    path: "/{ip}",
    request: {
      params: z.object({
        ip: z.string().ip().openapi({ example: "8.8.8.8" }),
      }),
      query: querySchema,
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
    const { ip } = c.req.valid("param");
    const { geo, risk, security } = c.req.valid("query");
    const promises: Promise<IpInfo>[] = [];
    if (geo) {
      promises.push(getGeo(ip));
    }
    if (risk) {
      promises.push(getRisk(ip));
    }
    if (security) {
      promises.push(getSecurity(ip));
    }
    const results: IpInfo[] = await Promise.all(promises);
    return c.json(Object.assign({ ip: ip }, ...results));
  }
);

async function getGeo(ip: string): Promise<IpInfo> {
  const response = await fetch(`https://api.ip.sb/geoip/${ip}`);
  const data = (await response.json()) as any;
  return {
    ip: ip,
    geo: {
      asn: data.asn,
      country: data.country,
      country_code: data.country_code,
      country_flag: data.country_code
        ? getFlagEmoji(data.country_code)
        : undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      organization: data.organization,
    },
  };
}

function getFlagEmoji(countryCode: string): string {
  const codePoints: number[] = [...countryCode].map(
    (char: string): number => 127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

async function getRisk(ip: string): Promise<IpInfo> {
  const response = await fetch(`https://proxycheck.io/v2/${ip}?risk=2`);
  const data = (await response.json()) as any;
  return {
    ip: ip,
    risk: {
      risk: data[ip].risk,
    },
  };
}

async function getSecurity(ip: string): Promise<IpInfo> {
  const response = await fetch(`https://api.ipapi.is?q=${ip}`);
  const data = (await response.json()) as any;
  return {
    ip: ip,
    security: {
      abuser: data.is_abuser,
      crawler: data.is_crawler,
      data_center: data.is_datacenter,
      proxy: data.is_proxy,
      tor: data.is_tor,
      vpn: data.is_vpn,
    },
  };
}
