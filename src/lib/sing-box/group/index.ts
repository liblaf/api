import {
  Outbound,
  OutboundSelector,
  OutboundURLTest,
} from "@/lib/sing-box/types/outbound";
import { OutboundTag } from "@/lib/sing-box/types/shared";
import { COUNTRIES, inferCountry } from "./country";
import { inferRate } from "./infer";

export interface GroupSelector {
  tag: string;
  outbounds: string[];
  build(): OutboundSelector | OutboundURLTest;
  filter(outbounds: Outbound[]): Outbound[];
}

export class Country implements GroupSelector {
  tag: string;
  outbounds: string[] = [];

  constructor(tag: string) {
    this.tag = tag;
  }

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: `https://cp.cloudflare.com`,
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country !== this.tag) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}

const AI_EXCLUDE_COUNTRIES = new Set([COUNTRIES.HK, COUNTRIES.OT]);

export class AI implements GroupSelector {
  tag: string = OutboundTag.AI;
  outbounds: string[] = [];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://cp.cloudflare.com",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (AI_EXCLUDE_COUNTRIES.has(country)) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}

export class Auto implements GroupSelector {
  tag: string = OutboundTag.AUTO;
  outbounds: string[] = [];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://cp.cloudflare.com",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country === COUNTRIES.OT) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}

export class Emby implements GroupSelector {
  tag: string = OutboundTag.EMBY;
  outbounds: string[] = [OutboundTag.DIRECT];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://emby.aca.best",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      if (/emby/i.test(outbound.tag)) {
        this.outbounds.push(outbound.tag);
        continue;
      }
      const rate: number = inferRate(outbound.tag);
      if (rate < 1) {
        this.outbounds.push(outbound.tag);
        continue;
      }
    }
    return [];
  }
}

export class Good implements GroupSelector {
  tag: string = OutboundTag.GOOD;
  outbounds: string[] = [];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://cp.cloudflare.com",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country === COUNTRIES.OT) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}

export class IPv6 implements GroupSelector {
  tag: string = OutboundTag.IPv6;
  outbounds: string[] = [OutboundTag.DIRECT];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://api-ipv6.ip.sb/ip",
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    const outboundsIPv6: Outbound[] = [];
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country === COUNTRIES.OT) continue;
      const outboundIPv6: Outbound = structuredClone(outbound);
      outboundIPv6.tag += "[IPv6]";
      outboundsIPv6.push(outboundIPv6);
      this.outbounds.push(outboundIPv6.tag);
    }
    return outboundsIPv6;
  }
}

export class Other implements GroupSelector {
  tag: string = OutboundTag.PROXY;
  outbounds: string[] = [];

  build(): OutboundSelector {
    return {
      tag: this.tag,
      type: "selector",
      outbounds: this.outbounds,
    };
  }

  filter(outbounds: Outbound[]): Outbound[] {
    for (const outbound of outbounds) {
      const country: string = inferCountry(outbound.tag);
      if (country !== COUNTRIES.OT) continue;
      this.outbounds.push(outbound.tag);
    }
    return [];
  }
}
