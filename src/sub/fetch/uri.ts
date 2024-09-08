import { fetchUnsafe } from "@utils/fetch";

export async function fetchUri(url: string, ua?: string): Promise<string[]> {
  const resp = await fetchUnsafe(
    url,
    ua ? { headers: { "User-Agent": ua } } : undefined,
  );
  const text = await resp.text();
  const uri = text.split("\n").filter((line) => line);
  return uri;
}
