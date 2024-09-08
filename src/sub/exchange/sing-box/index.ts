import type { Singbox } from "@sub/types/sing-box";
import type { Outbound } from "@sub/types/sing-box/outbound";
import { decodeBase64 } from "@utils/base64";
import { parseShadowsocks } from "./shadowsocks";
import { parseVmess } from "./vmess";

export function base64ToSingbox(base64: string): Singbox {
  return uriToSingbox(
    decodeBase64(base64)
      .split("\n")
      .filter((line) => line),
  );
}

export function uriToSingbox(uri: string[]): Singbox {
  return { outbounds: uri.map(parseUri) };
}

function parseUri(uri: string): Outbound {
  if (uri.startsWith("ss://")) return parseShadowsocks(uri);
  if (uri.startsWith("vmess://")) return parseVmess(uri);
  throw new Error(`Unknown URI: ${uri}`);
}
