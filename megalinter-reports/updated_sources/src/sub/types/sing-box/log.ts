import type { SingboxQuery } from './query'

export interface Log {
  disabled?: boolean
  level?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'panic'
  output?: string
  timestamp?: boolean
}

export function configLog (query: SingboxQuery): Log {
  return {
    disabled: false,
    level: 'warn'
  }
}
