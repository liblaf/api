export function inferRate(name: string): number {
  const match = name.match(/(([0-9]*[.])?[0-9]+)x/i);
  if (match) return Number.parseFloat(match[1]);
  if (name.match(/c\d+s\d+/)) {
    // JMS
    return 0;
  }
  return 1.0;
}
