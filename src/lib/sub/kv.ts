import type { Bindings } from "@lib/app";
import { Provider, type ProviderConfig } from "./provider/provider";
import type { Query } from "./query";

type Config = {
  providers?: ProviderConfig[];
  dns?: {
    bootstrap?: string;
    cn?: string;
    proxy?: string;
  };
};

export async function getConfig(
  env: Bindings,
  id: string,
  query: Query,
): Promise<{ providers?: Provider[]; query: Query }> {
  const value = await env.sub.get(id, "json");
  if (!value) return { query };
  const cfg = value as Config;
  query["dns.bootstrap"] ||= cfg.dns?.bootstrap;
  query["dns.cn"] ||= cfg.dns?.cn;
  query["dns.proxy"] ||= cfg.dns?.proxy;
  return {
    providers: cfg.providers?.map((c) => new Provider(c)),
    query: query,
  };
}

export async function getProviders(
  env: Bindings,
  id: string,
): Promise<Provider[] | undefined> {
  const value = await env.sub.get(id, "json");
  if (!value) return undefined;
  const cfg = value as Config;
  return cfg.providers?.map((c) => new Provider(c));
}
