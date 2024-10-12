// TODO: add inline rule-set (since sing-box 1.10.0)
export type RuleSet = RuleSetLocal | RuleSetRemote

interface RuleSetLocal {
  type: 'local'
  tag: string
  format: 'source' | 'binary'
  path: string
}

interface RuleSetRemote {
  type: 'remote'
  tag: string
  format: 'source' | 'binary'
  url: string
  download_detour?: string
  update_interval?: string
}
