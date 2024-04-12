import { Query } from "./query";
import { defaultConfig } from "./types";
import { Outbound, OutboundSelector, OutboundURLTest } from "./types/outbound";
import { fetchOutbounds } from "./provider";
import { AI, Auto, Country, Emby, Good, IPv6 } from "./group";
import { COUNTRIES } from "./group/country";

export async function convert(query: Query): Promise<any> {
  const urls: string[] = query.url;
  const config = defaultConfig(query);
  const outbounds: Outbound[] = (
    await Promise.all(urls.map((url) => fetchOutbounds(url, query)))
  ).flat();
  const proxyGroup = config.outbounds?.find(
    (outbound) => outbound.tag === "PROXY",
  )! as OutboundSelector;
  const groups = [
    new AI(),
    new Auto(),
    new Emby(),
    new Good(),
    new IPv6(),
    ...Object.values(COUNTRIES).map((country) => new Country(country)),
  ];
  for (const group of groups) {
    for (const outbound of outbounds) {
      group.push(outbound);
    }
    if (group.outbounds.length > 0) {
      config.outbounds?.push(group.build());
      proxyGroup.outbounds.push(group.tag);
    }
  }
  config.outbounds?.push(...outbounds);
  return config;
}
