import { Query } from "./query";
import { defaultConfig } from "./types";
import { Outbound, OutboundSelector } from "./types/outbound";
import { fetchOutbounds } from "./provider";
import { AI, Auto, Country, Emby, Good, IPv6 } from "./group";
import { COUNTRIES } from "./group/country";

export async function convert(query: Query): Promise<any> {
  const urls: URL[] = query.url;
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
