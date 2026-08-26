#
# Copyright (C) 2024 Nook Maintainers
# SPDX-License-Identifier: MIT
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-nook
PKG_VERSION:=0.0.1
PKG_RELEASE:=1

LUCI_TITLE:=LuCI support for Nook
LUCI_DEPENDS:=+luci-base +rpcd-mod-ucode
LUCI_PKGARCH:=all

# Runtime dependency note:
# This LuCI application controls the "nook" service via /etc/init.d/nook.
# The nook binary and init script are packaged independently and must be
# installed separately; they are not part of the official OpenWrt feeds.

include ../../luci.mk

# call BuildPackage - OpenWrt buildroot signature
