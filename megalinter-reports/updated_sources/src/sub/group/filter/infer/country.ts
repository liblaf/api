export function inferCountry (name: string): string {
  for (const [country, pattern] of Object.entries(REGEXPS)) {
    if (pattern.test(name)) return country
  }
  console.warn(`inferCountry(): ${name}`)
  return 'OT'
}

export function isCountry (name: string, country: string): boolean {
  if (country === 'OT') {
    const inferred = inferCountry(name)
    return inferred === 'OT'
  }
  return REGEXPS[country].test(name)
}

export const FLAGS: Record<string, string> = {
  AQ: '🇦🇶 Antarctica',
  AR: '🇦🇷 Argentina',
  AU: '🇦🇺 Australia',
  BR: '🇧🇷 Brazil',
  CA: '🇨🇦 Canada',
  DE: '🇩🇪 Germany',
  FR: '🇫🇷 France',
  GB: '🇬🇧 UK',
  HK: '🇭🇰 Hong Kong',
  IN: '🇮🇳 India',
  IS: '🇮🇸 Iceland',
  JP: '🇯🇵 Japan',
  KP: '🇰🇵 North Korea',
  KR: '🇰🇷 South Korea',
  MO: '🇲🇴 Macao',
  MY: '🇲🇾 Malaysia',
  NG: '🇳🇬 Nigeria',
  NL: '🇳🇱 Netherlands',
  NZ: '🇳🇿 New Zealand',
  PK: '🇵🇰 Pakistan',
  RU: '🇷🇺 Russia',
  SG: '🇸🇬 Singapore',
  TH: '🇹🇭 Thailand',
  TR: '🇹🇷 Türkiye',
  TW: '🇹🇼 Taiwan',
  US: '🇺🇸 US',

  OT: '🏳️‍🌈 Other'
}

const REGEXPS: Record<string, RegExp> = {
  AQ: /🇦🇶|AQ|Antarctica|南极洲/,
  AR: /🇦🇷|AR|Argentina|阿根廷/,
  AU: /🇦🇺|AU|Australia|澳大利亚/,
  BR: /🇧🇷|BR|Brazil|巴西/,
  CA: /🇨🇦|CA|Canada|加拿大/,
  DE: /🇩🇪|DE|Germany|德国|German/,
  FR: /🇫🇷|FR|France|法国/,
  GB: /🇬🇧|GB|UK|United Kingdom|英国/,
  HK: /🇭🇰|HK|Hong Kong|Hong Kong SAR China|香港|中国香港特别行政区/,
  IN: /🇮🇳|IN|India|印度/,
  IS: /🇮🇸|IS|Iceland|冰岛/,
  JP: /🇯🇵|JP|Japan|日本/,
  KP: /🇰🇵|KP|North Korea|朝鲜/,
  KR: /🇰🇷|KR|South Korea|韩国/,
  MO: /🇲🇴|MO|Macao|Macao SAR China|澳门|中国澳门特别行政区/,
  MY: /🇲🇾|MY|Malaysia|马来西亚/,
  NG: /🇳🇬|NG|Nigeria|尼日利亚/,
  NL: /🇳🇱|NL|Netherlands|荷兰/,
  NZ: /🇳🇿|NZ|New Zealand|新西兰/,
  PK: /🇵🇰|PK|Pakistan|巴基斯坦/,
  RU: /🇷🇺|RU|Russia|俄罗斯/,
  SG: /🇸🇬|SG|Singapore|新加坡/,
  TH: /🇹🇭|TH|Thailand|泰国/,
  TR: /🇹🇷|TR|Türkiye|土耳其|Turkey/,
  TW: /🇹🇼|TW|Taiwan|台湾/,
  US: /🇺🇸|US|United States|美国/
}
