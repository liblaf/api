import { z } from "zod";
import { isExcluded } from "../filter/infer";
import type { Filter } from "../filter/types";
import type { SingBoxConfig } from "../sing-box/config";
import type { Outbound } from "../sing-box/config/outbound";
import { fetchJMSSubscription, jmsURL } from "./justmysocks";
import { fetchSingBoxSubscription } from "./sing-box";
import { convertSingBoxSubscription } from "./subconverter";
import type { SubscriptionUserInfo } from "./types";

const PROVIDER_CONFIG_SCHEMA = z.object({
  name: z.string(),
  auto: z
    .object({
      url: z.string().url(),
      "user-agent": z.string().default("clash.meta"),
    })
    .optional(),
  jms: z.object({ service: z.string(), id: z.string() }).optional(),
  singbox: z
    .object({
      url: z.string().url(),
      "user-agent": z.string().default("sing-box"),
    })
    .optional(),
});

export type ProviderConfig = z.input<typeof PROVIDER_CONFIG_SCHEMA>;

export class Provider {
  config: z.infer<typeof PROVIDER_CONFIG_SCHEMA>;
  sub?: SingBoxConfig;
  info?: SubscriptionUserInfo;

  constructor(config: ProviderConfig) {
    this.config = PROVIDER_CONFIG_SCHEMA.parse(config);
  }

  async fetchNodes(...filters: Filter[]): Promise<Outbound[]> {
    let outbounds = await this.fetchAllNodes();
    outbounds = outbounds.filter((o) => !isExcluded(o.tag));
    for (const filter of filters)
      outbounds = outbounds.filter((o) => filter(o.tag));
    outbounds = JSON.parse(JSON.stringify(outbounds)); // clone
    for (const o of outbounds) o.tag += ` [${this.name}]`;
    return outbounds;
  }

  async fetchNodeNames(...filters: Filter[]): Promise<string[]> {
    const outbounds = await this.fetchNodes(...filters);
    return outbounds.map((o) => o.tag);
  }

  async fetchInfo(): Promise<SubscriptionUserInfo> {
    if (this.info) return this.info;
    const { info } = await this.fetchSubscription();
    return info ?? {};
  }

  get name(): string {
    return this.config.name;
  }

  get url(): string {
    if (this.config.singbox) return this.config.singbox.url;
    if (this.config.auto) return this.config.auto.url;
    if (this.config.jms)
      return jmsURL(this.config.jms.service, this.config.jms.id);
    return this.config.name;
  }

  private async fetchAllNodes(): Promise<Outbound[]> {
    if (this.sub) return this.sub.outbounds;
    const { sub } = await this.fetchSubscription();
    return sub.outbounds;
  }

  private async fetchSubscription(): Promise<{
    sub: SingBoxConfig;
    info?: SubscriptionUserInfo;
  }> {
    if (this.sub) return { sub: this.sub, info: this.info };
    if (this.config.singbox) {
      const { sub, info } = await fetchSingBoxSubscription(
        this.config.singbox.url,
        this.config.singbox["user-agent"],
      );
      this.sub = sub;
      if (info) this.info = info;
    } else if (this.config.auto) {
      const { sub, info } = await convertSingBoxSubscription(
        this.config.auto.url,
        this.config.auto["user-agent"],
      );
      this.sub = sub;
      if (info) this.info = info;
    } else if (this.config.jms) {
      const { sub, info } = await fetchJMSSubscription(
        this.config.jms.service,
        this.config.jms.id,
      );
      this.sub = sub;
      if (info) this.info = info;
    }
    if (!this.sub) {
      const url =
        this.config.singbox?.url || this.config.auto?.url || this.config.name;
      throw new Error(`Invalid subscription: ${url}`);
    }
    return { sub: this.sub, info: this.info };
  }
}
