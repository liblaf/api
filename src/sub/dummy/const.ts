import type {
  OutboundShadowsocks,
  OutboundVmess,
} from "@sub/types/sing-box/outbound";
import type { DummySubscription } from "./types";

export const DUMMY_SUBSCRIPTIONS: Record<string, DummySubscription> = {
  "shadowsocks-encode-uri": {
    base64:
      "c3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2VUVGVFUxZFBVa1JBWlhoaGJYQnNaUzVqYjIwNk1USXpORFUjTkFNRQo",
    uri: "ss://YWVzLTI1Ni1nY206UEFTU1dPUkRAZXhhbXBsZS5jb206MTIzNDU#NAME",
    singbox: {
      type: "shadowsocks",
      tag: "NAME",
      server: "example.com",
      server_port: 12345,
      method: "aes-256-gcm",
      password: "PASSWORD",
    } satisfies OutboundShadowsocks,
  },
  "shadowsocks-encode-userinfo": {
    base64:
      "c3M6Ly9ZV1Z6TFRJMU5pMW5ZMjA2VUVGVFUxZFBVa1FAZXhhbXBsZS5jb206MTIzNDUjTkFNRQo",
    uri: "ss://YWVzLTI1Ni1nY206UEFTU1dPUkQ@example.com:12345#NAME",
    singbox: {
      type: "shadowsocks",
      tag: "NAME",
      server: "example.com",
      server_port: 12345,
      method: "aes-256-gcm",
      password: "PASSWORD",
    } satisfies OutboundShadowsocks,
  },
  vmess: {
    base64:
      "dm1lc3M6Ly9leUp3Y3lJNklrNUJUVVVpTENKd2IzSjBJam9pTVRJek5EVWlMQ0pwWkNJNklqQXdNREF3TURBd0xUQXdNREF0TURBd01DMHdNREF3TFRBd01EQXdNREF3TURBd01DSXNJbUZwWkNJNk1Dd2libVYwSWpvaWRHTndJaXdpZEhsd1pTSTZJbTV2Ym1VaUxDSjBiSE1pT2lKdWIyNWxJaXdpWVdSa0lqb2lPQzQ0TGpndU9DSjkK",
    uri: "vmess://eyJwcyI6Ik5BTUUiLCJwb3J0IjoiMTIzNDUiLCJpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImFpZCI6MCwibmV0IjoidGNwIiwidHlwZSI6Im5vbmUiLCJ0bHMiOiJub25lIiwiYWRkIjoiOC44LjguOCJ9",
    singbox: {
      type: "vmess",
      tag: "NAME",
      server: "8.8.8.8",
      server_port: 12345,
      uuid: "00000000-0000-0000-0000-000000000000",
      alter_id: 0,
      security: "auto",
    } satisfies OutboundVmess,
  },
};
