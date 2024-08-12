import { FLAGS } from "../filter/infer/country";
import { createCountryFilter } from "../filter/smart";
import type { Provider } from "../provider/provider";
import { GROUPS, type Group, type Query } from "../query";
import { type SingBoxConfig, createConfig } from "./config";
import { OutboundTag } from "./config/const";
import type { OutboundSelector, OutboundURLTest } from "./config/outbound";

export async function generate(
  providers: Provider[],
  query: Query,
): Promise<SingBoxConfig> {
  const config = createConfig(query);
  const groups: Group[] = [];
  for (const g of query.group) {
    switch (g) {
      case "countries":
        for (const c in FLAGS)
          groups.push({ name: FLAGS[c], filter: createCountryFilter(c) });
        break;
      default:
        groups.push(createGroup(g));
    }
  }
  const proxy: OutboundSelector = {
    type: "selector",
    tag: OutboundTag.PROXY,
    outbounds: [],
  };
  config.outbounds.push(proxy);
  for (const g of groups) {
    const outbounds: string[] = [];
    for (const p of providers)
      outbounds.push(...(await p.fetchNodeNames(g.filter)));
    if (outbounds.length === 0) continue;
    config.outbounds.push({
      type: "urltest",
      tag: g.name,
      outbounds,
      url: "https://cp.cloudflare.com",
    } satisfies OutboundURLTest);
    proxy.outbounds.push(g.name);
  }
  const global: OutboundSelector = {
    type: "selector",
    tag: OutboundTag.GLOBAL,
    outbounds: [],
  };
  for (const p of providers)
    global.outbounds.push(...(await p.fetchNodeNames()));
  config.outbounds.push(global);
  proxy.outbounds.push(global.tag);
  for (const p of providers) config.outbounds.push(...(await p.fetchNodes()));
  return purge(config);
}

function createGroup(name: string): Group {
  if (name in GROUPS) return GROUPS[name];
  const country = name.toUpperCase();
  return { name: FLAGS[country], filter: createCountryFilter(country) };
}

function purge(config: SingBoxConfig): SingBoxConfig {
  const outbounds = new Set(config.outbounds.map((o) => o.tag));
  const routeRules = config.route.rules.filter((r) =>
    outbounds.has(r.outbound),
  );
  config.route.rules = routeRules;
  return config;
}
