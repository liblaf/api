import { createGroups } from "@sub/group";
import type { SingboxProvider } from "@sub/profile/provider/sing-box";
import { OutboundTag } from "@sub/types/const";
import { type Singbox, configSingbox } from "@sub/types/sing-box";
import type {
  OutboundSelector,
  OutboundURLTest,
} from "@sub/types/sing-box/outbound";
import type { SingboxQuery } from "@sub/types/sing-box/query";

export function genSingbox(
  providers: SingboxProvider[],
  query: SingboxQuery,
): Singbox {
  const config = configSingbox(query);
  const groups = createGroups(query.group);
  const proxy: OutboundSelector = {
    type: "selector",
    tag: OutboundTag.PROXY,
    outbounds: [],
  };
  config.outbounds!.push(proxy);
  for (const g of groups) {
    const outbounds: string[] = [];
    for (const p of providers) outbounds.push(...p.nodeNames(g.filter));
    if (outbounds.length === 0) continue;
    switch (g.type) {
      case "selector":
        config.outbounds!.push({
          type: "selector",
          tag: g.name,
          outbounds,
        } satisfies OutboundSelector);
        break;
      case "urltest":
        config.outbounds!.push({
          type: "urltest",
          tag: g.name,
          outbounds,
          url: "https://cp.cloudflare.com",
        } satisfies OutboundURLTest);
    }
    proxy.outbounds.push(g.name);
  }
  for (const p of providers) config.outbounds!.push(...p.nodes());
  return sanitize(config);
}

function sanitize(config: Singbox): Singbox {
  const outbounds = new Set(config.outbounds!.map((o) => o.tag));
  const routeRules = config.route?.rules?.filter((r) =>
    outbounds.has(r.outbound),
  );
  config.route!.rules = routeRules;
  return config;
}
