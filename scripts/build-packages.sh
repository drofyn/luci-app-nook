#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
TAG="${NOOK_TAG:-${GITHUB_REF_NAME:-v0.0.1}}"
NOOK_VERSION="${NOOK_VERSION:-${TAG#v}}"
NOOK_RELEASE="${NOOK_RELEASE:-1}"

case "$TAG" in
  v[0-9]*) ;;
  *)
    echo "NOOK_TAG or GITHUB_REF_NAME must be a v-prefixed version tag" >&2
    exit 1
    ;;
esac

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

export NOOK_VERSION NOOK_RELEASE

nfpm package -f "$ROOT_DIR/nfpm.yaml" -p ipk -t "$DIST_DIR/luci-app-nook_${NOOK_VERSION}-${NOOK_RELEASE}_all.ipk"
nfpm package -f "$ROOT_DIR/nfpm.yaml" -p apk -t "$DIST_DIR/luci-app-nook_${NOOK_VERSION}-r${NOOK_RELEASE}_all.apk"

ls -lh "$DIST_DIR"/*.ipk "$DIST_DIR"/*.apk
