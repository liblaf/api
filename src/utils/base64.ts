import { decodeBase64 as _decodeBase64 } from "hono/utils/encode";

export function decodeBase64(str: string): string {
  const arr = _decodeBase64(str);
  const text = new TextDecoder().decode(arr);
  return text;
}

export function tryDecodeBase64(str: string): string {
  try {
    return decodeBase64(str);
  } catch {
    return str;
  }
}
