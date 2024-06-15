import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES, type CountryCode } from "../provider/infer/country";
import type { SmartGroup } from "./abc";

export function newCountry(code: string): SmartGroup {
	const countryCode = code.toUpperCase() as CountryCode;
	const name = COUNTRIES[countryCode];
	return {
		name: name,
		filter: (outbound: string, provider: Provider): boolean => {
			if (provider.isEmby(outbound)) return false;
			const country = provider.country(outbound);
			if (country !== countryCode) return false;
			return true;
		},
	};
}
