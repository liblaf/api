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
	IS: "🇮🇸 Iceland (IS)",
	IT: "🇮🇹 Italy (IT)",
	KP: "🇰🇵 North Korea (KP)",
	LU: "🇱🇺 Luxembourg (LU)",
	MO: "🇲🇴 Macau (MO)",
	MY: "🇲🇾 Malaysia (MY)",
	NG: "🇳🇬 Nigeria (NG)",
	NL: "🇳🇱 Netherlands (NL)",
	NP: "🇳🇵 Nepal (NP)",
	NZ: "🇳🇿 New Zealand (NZ)",
	PK: "🇵🇰 Pakistan (PK)",
	RU: "🇷🇺 Russia (RU)",
	TH: "🇹🇭 Thailand (TH)",
	TR: "🇹🇷 Turkey (TR)",
	UK: "🇬🇧 United Kingdom (UK)",

	OT: "🏳️‍🌈 Other",
};

export type CountryCode = keyof typeof COUNTRIES;

const COUNTRY_PATTERNS: Record<CountryCode, RegExp> = {
	// https://github.com/ACL4SSR/ACL4SSR/blob/master/Clash/config/ACL4SSR_Online_Full_NoAuto.ini
	// https://github.com/NotSFC/subconverter-config/blob/main/external-config/sfc.ini
	HK: /港|HK|hk|Hong Kong|HongKong|hongkong|🇭🇰/,
	US: /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States|🇺🇲/,
	JP: /日本|川日|东京|大阪|泉日|埼玉|沪日|深日|\b日\b|JP|Japan|🇯🇵|广日/,
	SG: /新加坡|坡|狮城|SG|Singapore|🇸🇬|新/,
	TW: /台|新北|彰化|TW|Taiwan|🇹🇼/,
	KR: /KR|(?<!North )Korea|KOR|首尔|韩|韓|🇰🇷/,

	AQ: /🇦🇶|AQ|Antarctica|南极/,
	AR: /🇦🇷|AR|Argentina|阿根廷/,
	AU: /🇦🇺|AU|Australia|澳大利亚/,
	BR: /🇧🇷|BR|Brazil|巴西/,
	CA: /🇨🇦|CA|Canada|加拿大/,
	CH: /🇨🇭|CH|Switzerland|瑞士/,
	DE: /🇩🇪|DE|Germany|德/,
	FR: /🇫🇷|FR|France|法/,
	UK: /🇬🇧|UK|United Kingdom|英/,
	IN: /🇮🇳|IN|India|印/,
	IS: /🇮🇸|IS|Iceland|冰岛/,
	IT: /🇮🇹|\bIT\b|Italy|意大利/,
	KP: /🇰🇵|KP|North Korea|朝鲜/,
	LU: /🇱🇺|LU|Luxembourg|卢森堡/,
	MO: /🇲🇴|MO|Macau|Macao|澳门/,
	MY: /🇲🇾|MY|Malaysia|马来/,
	NG: /🇳🇬|NG|Nigeria|尼日利亚/,
	NL: /🇳🇱|NL|Netherlands|荷/,
	NP: /🇳🇵|NP|Nepal|尼泊尔/,
	NZ: /🇳🇿|NZ|New Zealand|新西兰/,
	PK: /🇵🇰|PK|Pakistan|巴基斯坦/,
	RU: /🇷🇺|RU|Russia|俄/,
	TH: /🇹🇭|TH|Thailand|泰/,
	TR: /🇹🇷|TR|Turkey|土耳其/,

	OT: /.*/,
};

export function inferCountry(name: string): CountryCode {
	if (name.includes("📝")) return "OT";
	for (const [key, pattern] of Object.entries(COUNTRY_PATTERNS)) {
		if (pattern.test(name)) return key as CountryCode;
	}
	return "OT";
}
