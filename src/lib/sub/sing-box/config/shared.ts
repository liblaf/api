export const OutboundTag = {
  AI: "💬 AI",
  AUTO: "🚀 Auto",
  DIRECT: "DIRECT",
  DNS: "DNS",
  EMBY: "🍟 Emby",
  GOOD: "⭐ Good",
  IPv6: "🌐 IPv6",
  ONEDRIVE: "☁️ OneDrive",
  PROXY: "PROXY",
  REJECT: "REJECT",
};

export type ClashMode = "rule" | "global" | "direct";

export function proxy(url: string): string {
  return `https://api.liblaf.me/proxy/${url}`;
}
