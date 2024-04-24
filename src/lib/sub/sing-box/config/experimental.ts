import { Query } from "../query";
import { ClashMode, OutboundTag, proxy } from "./shared";

export type Experimental = {
  cache_file?: CacheFile;
  clash_api?: ClashAPI;
};

type CacheFile = {
  enabled?: boolean;
  store_rdrc?: boolean;
};

type ClashAPI = {
  external_controller?: string;
  external_ui?: string;
  external_ui_download_url?: string;
  external_ui_download_detour?: string;
  secret?: string;
  default_mode?: ClashMode;
};

export function defaultExperimental(query: Query): Experimental {
  return {
    // TODO: sing-box 1.9.0-alpha.2+
    // cache_file: {
    //   enabled: true,
    //   store_rdrc: true,
    // },
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_url: proxy(
        "https://github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
      ),
      external_ui_download_detour: OutboundTag.DIRECT,
      default_mode: "rule",
    },
  };
}
