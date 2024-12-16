#!/bin/bash
set -o errexit -o nounset -o pipefail

action="$1"
id=$(rbw get --raw Telegram | jq --raw-output '.fields.[] | select(.name == "chat_id").value')
case "$action" in
  get)
    mkdir --parents --verbose kv
    wrangler kv key get "$id" --binding KV_SUB "${@:2}" > kv/profile.json
    ;;
  put) wrangler kv key put "$id" --binding KV_SUB --path kv/profile.json "${@:2}" ;;
  *)
    echo "Invalid action: $action" >&2
    exit 1
    ;;
esac
