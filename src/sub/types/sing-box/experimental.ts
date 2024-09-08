import { ClashMode, OutboundTag } from "../const";
import type { SingboxQuery } from "./query";

export type Experimental = {
  cache_file?: CacheFile;
  clash_api?: ClashAPI;
  v2ray_api?: V2RayAPI;
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
  access_control_allow_origin?: string[];
  access_control_allow_private_network?: boolean;
};

type V2RayAPI = {
  listen?: string;
  stats?: {
    enabled?: boolean;
    inbounds?: string[];
    outbounds?: string[];
    users?: string[];
  };
};

export function configExperimental(query: SingboxQuery): Experimental {
  return {
    cache_file: {
      enabled: true,
      store_fakeip: true,
      store_rdrc: true,
    },
    clash_api: {
      external_controller: "127.0.0.1:9090",
      external_ui: "ui",
      external_ui_download_url:
        "https://api.liblaf.me/proxy/github.com/MetaCubeX/metacubexd/archive/refs/heads/gh-pages.zip",
      external_ui_download_detour: OutboundTag.DIRECT,
      default_mode: ClashMode.RULE,
    },
  };
}
