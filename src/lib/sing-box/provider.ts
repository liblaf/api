import { HTTPException } from "hono/http-exception";
import { Query } from "./query";
import { Outbound } from "./types/outbound";

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

type NodeList = {
  name: string;
  outbounds: Outbound[];
};

type Provider = {
  pattern: RegExp;
  fetch: (sub: string, query: Query) => Promise<NodeList>;
};

function defaultFetch(name: string) {
  return async (sub: string, query: Query): Promise<NodeList> => {
    const data = await fetchSubConvert(sub, query);
    const outbounds = data.outbounds as Outbound[];
    return {
      name,
      outbounds,
    };
  };
}

const PROVIDERS: Provider[] = [
  {
    pattern: /aca/,
    fetch: defaultFetch("ACA"),
  },
  {
    pattern: /fldylink/,
    fetch: defaultFetch("FastLink"),
  },
  {
    pattern: /fbsublink/,
    fetch: defaultFetch("FlyingBird"),
  },
  {
    pattern: /nthu/,
    fetch: defaultFetch("NTHU.CC"),
  },
  {
    pattern: /cos.cat/,
    fetch: async (sub: string, query: Query): Promise<NodeList> => {
      const url = new URL(sub);
      url.searchParams.set("flag", "sing");
      const response = await fetch(url);
      const data = (await response.json()) as any;
      const outbounds = data.outbounds as Outbound[];
      return {
        name: "🏳️‍⚧️ 私房菜",
        outbounds,
      };
    },
  },
];

async function fetchSub(sub: string, query: Query): Promise<NodeList> {
  const url = new URL(sub);
  for (const provider of PROVIDERS) {
    if (provider.pattern.test(url.hostname)) {
      return await provider.fetch(sub, query);
    }
  }
  throw new HTTPException(400, { message: `Unsupported sub: ${sub}` });
}

async function fetchSubConvert(sub: string, { backend }: Query): Promise<any> {
  const url = new URL(backend);
  url.searchParams.set("target", "singbox");
  url.searchParams.set("list", "true");
  url.search += `&url=${encodeURIComponent(sub)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const message: string = await response.text();
    throw new HTTPException(response.status as any, { message: message });
  }
  const data = await response.json();
  return data;
}
