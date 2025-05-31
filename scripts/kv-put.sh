#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

NAMESPACE_ID="${NAMESPACE_ID:-"9ee893b26f644ffa8310b02483aa9934"}"

function put() {
  wrangler kv key put "$1" --namespace-id "$NAMESPACE_ID" --path "$2" --local
  wrangler kv key put "$1" --namespace-id "$NAMESPACE_ID" --path "$2" --remote
}

put "mihomo.yaml" "/etc/clash-meta/config.yaml"
