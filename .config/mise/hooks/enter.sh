#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

if [[ ! -f ".dev.vars" ]]; then
  mise run dev.vars
fi

if [[ ! -f "worker-configuration.d.ts" ]]; then
  bun run cf-typegen
fi
