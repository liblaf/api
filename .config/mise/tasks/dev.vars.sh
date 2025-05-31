#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

UUID="$(rbw get --field "UUID" "API")"

(
  printf "UUID=%q" "$UUID"
  echo
) > ".dev.vars"
