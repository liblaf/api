import type { SubscriptionUserinfo } from "@sub/types/info";
import {
  PROFILE_OPTIONS_SCHEMA,
  type ProfileOptions,
} from "@sub/types/profile";
import { Airport } from "./provider";
import type { SingboxProvider } from "./provider/sing-box";

export class Profile {
  providers: Airport[];

  constructor(opts: ProfileOptions) {
    const parsed = PROFILE_OPTIONS_SCHEMA.parse(opts);
    this.providers = parsed.providers.map((p) => new Airport(p));
  }

  async fetchSubInfo(): Promise<
    { name: string; url: string; info: SubscriptionUserinfo; error?: string }[]
  > {
    return Promise.all(
      this.providers.map(async (p) => {
        try {
          const info: SubscriptionUserinfo = await p.fetchSubInfo();
          return {
            name: p.name,
            url: p.url,
            info,
          };
        } catch (err) {
          return {
            name: p.name,
            url: p.url,
            info: {},
            error: `${err}`,
          };
        }
      }),
    );
  }

  async fetchSingbox(): Promise<SingboxProvider[]> {
    return Promise.all(this.providers.map(async (p) => p.fetchSingbox()));
  }
}
