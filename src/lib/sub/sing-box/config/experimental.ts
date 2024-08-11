import { proxyURL } from "@lib/utils";
import type { Params } from "../types";
import { ClashMode, OutboundTag } from "./const";

export type Experimental = {
  cache_file?: CacheFile;
  clash_api?: ClashAPI;
};

type CacheFile = {
  enabled?: boolean;
  path?: string;
  cache_id?: string;
  store_fakeip?: boolean;
  store_rdrc?: boolean;
  rdrc_timeout?: string;
};

type ClashAPI = {
  external_controller?: string;
  external_ui?: string;
  external_ui_download_url?: string;
  external_ui_download_detour?: string;
  secret?: string;
  default_mode?: string;
};

export function createConfigExperimental({ tun }: Params): Experimental {
  return {
    cache_file: {
      enabled: true,
      store_fakeip: true,
      store_rdrc: true,
    },
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_url: proxyURL(
        "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
      ),
      external_ui_download_detour: OutboundTag.DIRECT,
      default_mode: ClashMode.RULE,
    },
  };
}
