export const COUNTRIES = {
  HK: "🇭🇰 Hong Kong (HK)",
  US: "🇺🇲 United States (US)",
  JP: "🇯🇵 Japan (JP)",
  SG: "🇸🇬 Singapore (SG)",
  TW: "🇹🇼 Taiwan (TW)",
  KR: "🇰🇷 South Korea (KR)",
  OT: "🏳️‍🌈 Other",

  MO: "🇲🇴 Macau (MO)",
  AU: "🇦🇺 Australia (AU)",
  IN: "🇮🇳 India (IN)",
  MY: "🇲🇾 Malaysia (MY)",
  NP: "🇳🇵 Nepal (NP)",
  BR: "🇧🇷 Brazil (BR)",
  AQ: "🇦🇶 Antarctica (AQ)",
  AR: "🇦🇷 Argentina (AR)",
  DE: "🇩🇪 Germany (DE)",
  IT: "🇮🇹 Italy (IT)",
  LU: "🇱🇺 Luxembourg (LU)",
  NG: "🇳🇬 Nigeria (NG)",
  RU: "🇷🇺 Russia (RU)",
  TR: "🇹🇷 Turkey (TR)",
  UK: "🇬🇧 United Kingdom (UK)",
};

const COUNTRY_PATTERNS: Record<string, RegExp> = {
  // https://github.com/ACL4SSR/ACL4SSR/blob/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini
  // https://github.com/NotSFC/subconverter-config/blob/main/external-config/sfc.ini
  "🇭🇰 Hong Kong (HK)": /港|HK|hk|Hong Kong|HongKong|hongkong/,
  "🇺🇲 United States (US)":
    /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States/,
  "🇯🇵 Japan (JP)": /日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\b日\b|JP|Japan/,
  "🇸🇬 Singapore (SG)": /新加坡|坡|狮城|SG|Singapore/,
  "🇹🇼 Taiwan (TW)": /台|新北|彰化|TW|Taiwan/,
  "🇰🇷 South Korea (KR)": /KR|Korea|KOR|首尔|韩|韓/,

  "🇲🇴 Macau (MO)": /🇲🇴|MO|Macau/,
  "🇦🇺 Australia (AU)": /🇦🇺|AU|Australia/,
  "🇮🇳 India (IN)": /🇮🇳|IN|India/,
  "🇲🇾 Malaysia (MY)": /🇲🇾|MY|Malaysia/,
  "🇳🇵 Nepal (NP)": /🇳🇵|NP|Nepal/,
  "🇧🇷 Brazil (BR)": /🇧🇷|BR|Brazil/,
  "🇦🇶 Antarctica (AQ)": /🇦🇶|AQ|Antarctica/,
  "🇦🇷 Argentina (AR)": /🇦🇷|AR|Argentina/,
  "🇩🇪 Germany (DE)": /🇩🇪|DE|Germany/,
  "🇮🇹 Italy (IT)": /🇮🇹|IT|Italy/,
  "🇱🇺 Luxembourg (LU)": /🇱🇺|LU|Luxembourg/,
  "🇳🇬 Nigeria (NG)": /🇳🇬|NG|Nigeria/,
  "🇷🇺 Russia (RU)": /🇷🇺|RU|Russia/,
  "🇹🇷 Turkey (TR)": /🇹🇷|TR|Turkey/,
  "🇬🇧 United Kingdom (UK)": /🇬🇧|UK|United Kingdom/,
};

export function inferCountry(tag: string): string {
  for (const [key, pattern] of Object.entries(COUNTRY_PATTERNS)) {
    if (pattern.test(tag)) {
      return key;
    }
  }
  return COUNTRIES.OT;
}
