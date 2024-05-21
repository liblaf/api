import { COUNTRIES } from "../infer/country";
import { newProvider } from "../provider/factory";
import { Config, defaultConfig } from "./config";
import { Outbound, OutboundSelector } from "./config/outbound";
import { SmartGroup } from "./group/abc";
import { AI } from "./group/ai";
import { Auto } from "./group/auto";
import { Country } from "./group/country";
import { Emby } from "./group/emby";
import { IPv6 } from "./group/ipv6";
import { OneDrive } from "./group/onedrive";
import { Query } from "./query";

export async function convert(urls: URL[], query: Query): Promise<Config> {
  const config = defaultConfig(query);
  config.outbounds ??= [];
  const providers = urls.map((url: URL) => newProvider(url));
  const proxyGroup = config.outbounds.find(
    (outbound) => outbound.tag === "PROXY",
  )! as OutboundSelector;
  const groups: SmartGroup[] = [
    new AI(),
    new Auto(),
    new Emby(),
    new OneDrive(),
  ];
  if (query.ipv6) groups.push(new IPv6());
  groups.push(
    ...Object.values(COUNTRIES).map((country) => new Country(country)),
  );
  const outbounds: Outbound[] = [];
  const outboundsMap: Record<string, Outbound[]> = (
    await Promise.all(
      providers.map(async (provider) => {
        const config = await provider.fetchSingBox();
        return {
          [provider.name]:
            config.outbounds?.map((outbound) => ({
              ...outbound,
              tag: outbound.tag + ` [${provider.name}]`,
            })) ?? [],
        };
      }),
    )
  ).reduce((acc, cur) => ({ ...acc, ...cur }), {});
  for (const provider of providers) {
    const outs = outboundsMap[provider.name];
    outbounds.push(...outs);
    for (const group of groups) {
      const aux = group.extend(outs, provider);
      outbounds.push(...aux);
    }
  }
  for (const group of groups) {
    if (group.outbounds.length > 0) {
      config.outbounds.push(group.build());
      proxyGroup.outbounds.push(group.tag);
    }
  }
  config.outbounds.push(...outbounds);
  return config;
}
