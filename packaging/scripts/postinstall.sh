#!/bin/sh
set -eu

rm -rf /tmp/luci-modulecache /tmp/luci-indexcache.* 2>/dev/null || true
/etc/init.d/rpcd reload >/dev/null 2>&1 || true
