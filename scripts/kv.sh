#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

action="$1"
id=$(bw get item 'Telegram' | jq --raw-output '.fields.[] | select(.name == "chat_id").value')
case "$action" in
  get)
    mkdir --parents --verbose kv
    wrangler kv key get "$id" --binding sub "${@:2}" > kv/profile.json
    ;;
  put) wrangler kv key put "$id" --binding sub --path kv/profile.json "${@:2}" ;;
  *)
    echo "Invalid action: $action" >&2
    exit 1
    ;;
esac
