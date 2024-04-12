export function toSimplified(text: string): string {
  return text.replaceAll("國", "国").replaceAll("灣", "湾");
}
