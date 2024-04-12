export const COUNTRIES = {
  HK: "🇭🇰 Hong Kong (HK)",
  US: "🇺🇲 United States (US)",
  JP: "🇯🇵 Japan (JP)",
  SG: "🇸🇬 Singapore (SG)",
  TW: "🇹🇼 Taiwan (TW)",
  KR: "🇰🇷 South Korea (KR)",

  AQ: "🇦🇶 Antarctica (AQ)",
  AR: "🇦🇷 Argentina (AR)",
  AU: "🇦🇺 Australia (AU)",
  BR: "🇧🇷 Brazil (BR)",
  CA: "🇨🇦 Canada (CA)",
  CH: "🇨🇭 Switzerland (CH)",
  DE: "🇩🇪 Germany (DE)",
  FR: "🇫🇷 France (FR)",
  IN: "🇮🇳 India (IN)",
  IT: "🇮🇹 Italy (IT)",
  LU: "🇱🇺 Luxembourg (LU)",
  MO: "🇲🇴 Macau (MO)",
  MY: "🇲🇾 Malaysia (MY)",
  NG: "🇳🇬 Nigeria (NG)",
  NP: "🇳🇵 Nepal (NP)",
  NZ: "🇳🇿 New Zealand (NZ)",
  PK: "🇵🇰 Pakistan (PK)",
  RU: "🇷🇺 Russia (RU)",
  TR: "🇹🇷 Turkey (TR)",
  UK: "🇬🇧 United Kingdom (UK)",

  OT: "🏳️‍🌈 Other",
};

const COUNTRY_PATTERNS: Record<string, RegExp> = {
  // https://github.com/ACL4SSR/ACL4SSR/blob/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini
  // https://github.com/NotSFC/subconverter-config/blob/main/external-config/sfc.ini
  "🇭🇰 Hong Kong (HK)": /港|HK|hk|Hong Kong|HongKong|hongkong/,
  "🇺🇲 United States (US)":
    /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States/,
  "🇯🇵 Japan (JP)":
    /日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\b日\b|JP|Japan|广日/,
  "🇸🇬 Singapore (SG)": /新加坡|坡|狮城|SG|Singapore|新/,
  "🇹🇼 Taiwan (TW)": /台|新北|彰化|TW|Taiwan/,
  "🇰🇷 South Korea (KR)": /KR|Korea|KOR|首尔|韩|韓/,

  "🇦🇶 Antarctica (AQ)": /🇦🇶|AQ|Antarctica/,
  "🇦🇷 Argentina (AR)": /🇦🇷|AR|Argentina|阿根廷/,
  "🇦🇺 Australia (AU)": /🇦🇺|AU|Australia|澳/,
  "🇧🇷 Brazil (BR)": /🇧🇷|BR|Brazil|巴西/,
  "🇨🇦 Canada (CA)": /🇨🇦|CA|Canada|加拿大/,
  "🇨🇭 Switzerland (CH)": /🇨🇭|CH|Switzerland|瑞士/,
  "🇩🇪 Germany (DE)": /🇩🇪|DE|Germany|德/,
  "🇫🇷 France (FR)": /🇫🇷|FR|France|法/,
  "🇬🇧 United Kingdom (UK)": /🇬🇧|UK|United Kingdom|英/,
  "🇮🇳 India (IN)": /🇮🇳|IN|India|印/,
  "🇮🇹 Italy (IT)": /🇮🇹|\bIT\b|Italy|意大利/,
  "🇱🇺 Luxembourg (LU)": /🇱🇺|LU|Luxembourg|卢森堡/,
  "🇲🇴 Macau (MO)": /🇲🇴|MO|Macau|澳/,
  "🇲🇾 Malaysia (MY)": /🇲🇾|MY|Malaysia|马来/,
  "🇳🇬 Nigeria (NG)": /🇳🇬|NG|Nigeria|尼日利亚/,
  "🇳🇵 Nepal (NP)": /🇳🇵|NP|Nepal|尼泊尔/,
  "🇳🇿 New Zealand (NZ)": /🇳🇿|NZ|New Zealand|新西兰/,
  "🇵🇰 Pakistan (PK)": /🇵🇰|PK|Pakistan|巴基斯坦/,
  "🇷🇺 Russia (RU)": /🇷🇺|RU|Russia|俄/,
  "🇹🇷 Turkey (TR)": /🇹🇷|TR|Turkey|土耳其/,
};

export function inferCountry(tag: string): string {
  for (const [key, pattern] of Object.entries(COUNTRY_PATTERNS)) {
    if (pattern.test(tag)) {
      return key;
    }
  }
  return COUNTRIES.OT;
}
