import { HTTPException } from "hono/http-exception";
import { Query } from "./query";
import { Outbound } from "./types/outbound";

type Provider = {
  name: string;
  fetch?: (sub: string) => Promise<Outbound[]>;
};

const PROVIDERS: Record<string, Provider> = {
  "cos.cat": {
    name: "🏳️‍⚧️ 私房菜",
    fetch: async (sub: string): Promise<Outbound[]> => {
      const url = new URL(sub);
      url.searchParams.set("flag", "sing");
      const response = await fetch(url);
      const data = (await response.json()) as any;
      const outbounds: Outbound[] = data.outbounds;
      return outbounds;
    },
  },
};

const EXCLUDE_OUTBOUND_TYPES = new Set([
  "direct",
  "block",
  "dns",
  "selector",
  "urltest",
]);

export async function fetchOutbounds(
  sub: string,
  query: Query,
): Promise<Outbound[]> {
  try {
    let { name, outbounds } = await fetchSub(sub, query);
    outbounds = outbounds.filter(
      (outbound) => !EXCLUDE_OUTBOUND_TYPES.has(outbound.type),
    );
    outbounds.forEach((outbound) => {
      outbound.tag = `${outbound.tag} [${name}]`;
    });
    return outbounds;
  } catch (err) {
    throw new HTTPException(err instanceof HTTPException ? err.status : 500, {
      message: `Failed to fetch "${sub}": ${err}`,
    });
  }
}

async function fetchSub(
  sub: string,
  query: Query,
): Promise<{ name: string; outbounds: Outbound[] }> {
  const url = new URL(sub);
  for (const [key, provider] of Object.entries(PROVIDERS)) {
    if (url.hostname.endsWith(key)) {
      if (provider.fetch) {
        return {
          name: provider.name,
          outbounds: await provider.fetch(sub),
        };
      } else {
        return {
          name: provider.name,
          outbounds: await fetchSubConvert(sub, query),
        };
      }
    }
  }
  return {
    name: url.hostname,
    outbounds: await fetchSubConvert(sub, query),
  };
}

async function fetchSubConvert(sub: string, { backend }: Query): Promise<any> {
  const url = new URL(backend);
  url.searchParams.set("target", "singbox");
  url.searchParams.set("list", "true");
  url.search += `&sub=${encodeURIComponent(sub)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new HTTPException(response.status as any, {
      message: await response.text(),
    });
  }
  const data = await response.json();
  return data;
}
