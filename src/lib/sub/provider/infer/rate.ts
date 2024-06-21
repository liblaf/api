export function inferRate(tag: string): number {
  const match = tag.match(/(([0-9]*[.])?[0-9]+)x/i);
  if (match) return Number.parseFloat(match[1]);
  return 1.0;
}
