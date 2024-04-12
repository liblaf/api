const RATE_PATTERN = /(([0-9]*[.])?[0-9]+)x/i;

export function inferRate(tag: string): number {
  const match = tag.match(RATE_PATTERN);
  return match ? parseFloat(match[1]) : 1;
}
