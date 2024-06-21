import type { SmartGroup } from "./abc";
import { Ai } from "./ai";
import { Auto } from "./auto";
import { Balance } from "./balance";
import { Country } from "./country";
import { Emby } from "./emby";
import { Media } from "./media";
import { OneDrive } from "./onedrive";

export function makeSmartGroup(name: string): SmartGroup {
  switch (name) {
    case "ai":
      return new Ai();
    case "auto":
      return new Auto();
    case "balance":
      return new Balance();
    case "emby":
      return new Emby();
    case "ipv6": // TODO
      throw new Error("Not implemented");
    case "media":
      return new Media();
    case "onedrive":
      return new OneDrive();
    default:
      return new Country(name);
  }
}
