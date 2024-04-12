export function toSimplified(text: string): string {
  return text
    .replaceAll("國", "国")
    .replaceAll("東", "东")
    .replaceAll("灣", "湾");
}
