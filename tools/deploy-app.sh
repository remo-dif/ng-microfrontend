#!/usr/bin/env bash
set -euo pipefail

app="${1:?app is required}"
base="${2:?base SHA is required}"
head="${3:?head SHA is required}"

if ! pnpm nx show projects --affected --base="$base" --head="$head" | grep -qx "$app"; then
  echo "$app is unaffected; skipping deployment"
  exit 0
fi

if [[ "$app" == "shell" ]]; then node tools/generate-federation-manifest.mjs; fi
pnpm nx run "$app:federation-build"

bucket="$(node -e "process.stdout.write(JSON.parse(process.env.S3_BUCKETS_JSON)[process.env.APP] || '')")"
distribution="$(node -e "process.stdout.write(JSON.parse(process.env.CLOUDFRONT_DISTRIBUTIONS_JSON)[process.env.APP] || '')")"
[[ -n "$bucket" && -n "$distribution" ]] || { echo "Missing deploy mapping for $app"; exit 1; }

output="dist/$app/browser"
[[ "$app" == "shell" ]] && output="dist/apps/shell/browser"
aws s3 sync "$output" "s3://$bucket" --delete --exclude "index.html" --exclude "remoteEntry.json" --exclude "federation.manifest.json" --cache-control "public,max-age=31536000,immutable"
aws s3 cp "$output/index.html" "s3://$bucket/index.html" --cache-control "no-cache,no-store,must-revalidate" --content-type "text/html"
if [[ -f "$output/remoteEntry.json" ]]; then aws s3 cp "$output/remoteEntry.json" "s3://$bucket/remoteEntry.json" --cache-control "no-cache,no-store,must-revalidate" --content-type "application/json"; fi
if [[ -f "$output/federation.manifest.json" ]]; then aws s3 cp "$output/federation.manifest.json" "s3://$bucket/federation.manifest.json" --cache-control "no-cache,no-store,must-revalidate" --content-type "application/json"; fi
aws cloudfront create-invalidation --distribution-id "$distribution" --paths "/index.html" "/remoteEntry.json" "/federation.manifest.json"
