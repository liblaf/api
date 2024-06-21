import type { Provider } from "@lib/sub/provider/abc";
import { COUNTRIES, type CountryCode } from "../provider/infer/country";
import { SmartGroup } from "./abc";

export class Country extends SmartGroup {
  name: string;
  code: string;

  constructor(code: string) {
    super();
    this.code = code.toUpperCase();
    this.name = COUNTRIES[this.code as CountryCode];
  }

  filter(name: string, provider: Provider): boolean {
    if (provider.isEmby(name)) return false;
    const country = provider.country(name);
    if (country !== this.code) return false;
    return true;
  }
}
