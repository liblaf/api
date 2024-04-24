import { COUNTRIES } from "../infer/country";
import { defaultConfig } from "./config";
import { Outbound, OutboundSelector } from "./config/outbound";
import { SmartGroup } from "./group";
import { AI } from "./group/ai";
import { Auto } from "./group/auto";
import { Country } from "./group/country";
import { Emby } from "./group/emby";
import { IPv6 } from "./group/ipv6";
import { fetchOutbounds } from "./provider";
import { Query } from "./query";

export async function convert(urls: URL[], query: Query): Promise<any> {
  const config = defaultConfig(query);
  const outbounds: Outbound[] = (
    await Promise.all(urls.map((url) => fetchOutbounds(url, query)))
  ).flat();
  const proxyGroup = config.outbounds?.find(
    (outbound) => outbound.tag === "PROXY",
  )! as OutboundSelector;
  const groups: SmartGroup[] = [new AI(), new Auto(), new Emby()];
  if (query.ipv6) groups.push(new IPv6());
  groups.push(
    ...Object.values(COUNTRIES).map((country) => new Country(country)),
  );
  const outboundsAux: Outbound[] = [];
  for (const group of groups) {
    outboundsAux.push(...group.filter(outbounds));
    if (group.outbounds.length > 0) {
      config.outbounds?.push(group.build());
      proxyGroup.outbounds.push(group.tag);
    }
  }
  config.outbounds?.push(...outbounds);
  config.outbounds?.push(...outboundsAux);
  return config;
}
