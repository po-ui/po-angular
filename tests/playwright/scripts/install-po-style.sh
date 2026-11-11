#!/usr/bin/env bash
# Builda o po-style, empacota (npm pack) e instala no po-angular (--no-save).
# Branch do po-style: a MESMA branch do PR no po-angular se existir lá; senão a base do PR.
# Uso: install-po-style.sh <branch-do-pr> <branch-base> [pasta-destino-do-clone]
set -euo pipefail

HEAD_BRANCH="${1:?branch do PR}"
BASE_BRANCH="${2:?branch base}"
DEST="${3:-${RUNNER_TEMP:-${TMPDIR:-/tmp}}/po-style}"
REPO="${PO_STYLE_REPO:-https://github.com/po-ui/po-style.git}"

if git ls-remote --exit-code --heads "$REPO" "$HEAD_BRANCH" >/dev/null 2>&1; then
  STYLE_BRANCH="$HEAD_BRANCH"
else
  STYLE_BRANCH="$BASE_BRANCH"
fi
echo "po-style: usando branch '$STYLE_BRANCH'"

rm -rf "$DEST"
git clone --depth 1 --branch "$STYLE_BRANCH" "$REPO" "$DEST"
(cd "$DEST" && npm ci --ignore-scripts --no-audit --no-fund 2>/dev/null || npm install --ignore-scripts --no-audit --no-fund --legacy-peer-deps)
(cd "$DEST" && npm run build)
TGZ="$(cd "$DEST/dist/style" && npm pack --silent | tail -1)"
npm install --no-save --ignore-scripts --legacy-peer-deps --no-audit --no-fund "$DEST/dist/style/$TGZ"
echo "po-style instalado a partir de $DEST/dist/style/$TGZ"
