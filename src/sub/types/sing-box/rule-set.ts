// TODO: add inline rule-set (since sing-box 1.10.0)
export type RuleSet = RuleSetLocal | RuleSetRemote;

type RuleSetLocal = {
  type: "local";
  tag: string;
  format: "source" | "binary";
  path: string;
};

type RuleSetRemote = {
  type: "remote";
  tag: string;
  format: "source" | "binary";
  url: string;
  download_detour?: string;
  update_interval?: string;
};
