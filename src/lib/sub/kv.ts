import type { Bindings } from "@lib/app";
import { Provider, type ProviderConfig } from "./provider/provider";

type Config = {
  providers: ProviderConfig[];
};

export async function getProviders(
  env: Bindings,
  id: string,
): Promise<Provider[] | null> {
  const value = await env.sub.get(id, "json");
  if (!value) return null;
  const configs = (value as Config).providers;
  const providers = configs.map((cfg) => new Provider(cfg));
  return providers;
}
