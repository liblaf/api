import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES, type CountryCode } from "../provider/infer/country";
import { SmartGroup } from "./abc";

export class Country extends SmartGroup {
  name: string;

  constructor(code: string) {
    super();
    const countryCode = code.toUpperCase() as CountryCode;
    this.name = COUNTRIES[countryCode];
  }

  filter(name: string, provider: Provider): boolean {
    if (provider.isEmby(name)) return false;
    const country = provider.country(name);
    if (country !== name) return false;
    return true;
  }
}
