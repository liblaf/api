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
  push(outbound: Outbound): void;
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

  push(outbound: Outbound): void {
    const country: string = inferCountry(outbound.tag);
    if (country !== this.tag) return;
    this.outbounds.push(outbound.tag);
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

  push(outbound: Outbound) {
    const country: string = inferCountry(outbound.tag);
    if (AI_EXCLUDE_COUNTRIES.has(country)) return;
    this.outbounds.push(outbound.tag);
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

  push(outbound: Outbound) {
    const country: string = inferCountry(outbound.tag);
    if (country === COUNTRIES.OT) return;
    this.outbounds.push(outbound.tag);
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

  push(outbound: Outbound) {
    if (/emby/i.test(outbound.tag)) {
      this.outbounds.push(outbound.tag);
      return;
    }
    const rate: number = inferRate(outbound.tag);
    if (rate < 1) {
      this.outbounds.push(outbound.tag);
      return;
    }
  }
}

export class Good implements GroupSelector {
  tag: string = OutboundTag.GOOD;
  outbounds: string[] = [OutboundTag.DIRECT];

  build(): OutboundURLTest {
    return {
      tag: this.tag,
      type: "urltest",
      outbounds: this.outbounds,
      url: "https://cp.cloudflare.com",
    };
  }

  push(outbound: Outbound) {
    const country: string = inferCountry(outbound.tag);
    if (country === COUNTRIES.OT) return;
    this.outbounds.push(outbound.tag);
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

  push(outbound: Outbound) {
    const country: string = inferCountry(outbound.tag);
    if (country === COUNTRIES.OT) return;
    this.outbounds.push(outbound.tag);
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

  push(outbound: Outbound) {
    const country: string = inferCountry(outbound.tag);
    if (country !== COUNTRIES.OT) return;
    this.outbounds.push(outbound.tag);
  }
}
