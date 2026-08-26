# luci-app-nook

LuCI web interface for the Nook LAN collaboration service.

Nook 是一个局域网协作服务。本应用为 OpenWrt / ImmortalWrt 提供基于 LuCI 的 Web 管理界面。

## 功能

- 在 **Services → Nook** 菜单中管理 Nook 服务
- 查看 Nook 运行状态（running）和开机自启状态（enabled）
- 通过按钮启用/禁用开机自启
- 配置 Nook 的启用开关和监听地址

## 依赖

本 LuCI 应用在编译时依赖：

- `luci-base`
- `rpcd-mod-ucode`

**运行时依赖**：

- `nook` 服务本体（`/etc/init.d/nook` 与对应的二进制）

> 注意：`nook` 服务本体不在 OpenWrt 官方 feed 中，需要单独安装。本包不会强制拉取 `nook`，安装后若未安装服务本体，界面中的启动/停止按钮将无法生效。

## 安装

如果你的设备已经启用了自定义软件源，直接安装：

```bash
opkg update
opkg install luci-app-nook
```

安装后刷新 LuCI 页面或执行：

```bash
rm -rf /tmp/luci-modulecache /tmp/luci-indexcache.*
/etc/init.d/rpcd reload
```

（标准 LuCI 包的 postinst 会自动完成缓存清理和 rpcd 重载。）

## 编译方法

### 方法一：nFPM（推荐，快速打包）

本仓库使用 [nFPM](https://nfpm.goreleaser.com/) 生成 OpenWrt `.ipk` 和 `.apk` 包。

1. 安装 nFPM：

```bash
go install github.com/goreleaser/nfpm/v2/cmd/nfpm@latest
```

2. 构建：

```bash
export NOOK_VERSION=0.0.1
export NOOK_RELEASE=1
sh scripts/build-packages.sh
```

产物位于 `dist/` 目录，例如：

```text
luci-app-nook_0.0.1-1_all.ipk
luci-app-nook_0.0.1-r1_all.apk
```

### 方法二：放入 OpenWrt / ImmortalWrt feed（未验证）

`Makefile` 按标准 LuCI 应用结构编写，但尚未通过 OpenWrt 源码树 / SDK 实际编译验证。如果你需要从 OpenWrt 源码树编译标准的 `.ipk`：

1. 把本仓库复制到 OpenWrt 源码树的 feed 目录：

```bash
cp -r /path/to/luci-app-nook openwrt/feeds/luci/applications/luci-app-nook
```

2. 更新 feeds 并编译：

```bash
cd openwrt
./scripts/feeds update luci
./scripts/feeds install luci-app-nook
make menuconfig  # 选择 LuCI -> Applications -> luci-app-nook
make package/luci-app-nook/compile V=s
```

### 通过 Git tag 发布

只有推送 `v*` 开头的 tag 时才会触发 CI 构建。

推送形如 `v1.2.3` 的 tag 时，CI 会自动：

1. 以 tag 名称作为版本号构建 nFPM 包（`v1.2.3` 会去掉前缀 `v`）；
2. 将 `.ipk` 和 `.apk` 产物上传到该 tag 对应的 GitHub Release（不存在则自动创建）。

```bash
git tag v1.2.3
git push origin v1.2.3
```

### 测试 CI

推送测试 tag：

```bash
git tag v0.0.0-test.1
git push origin v0.0.0-test.1
```

构建完成后可以删除该 tag 和对应的 Release：

```bash
git push --delete origin v0.0.0-test.1
git tag -d v0.0.0-test.1
```

2. 构建：

```bash
export NOOK_VERSION=0.0.1
export NOOK_RELEASE=1
nfpm pkg --packager deb --target dist/
nfpm pkg --packager apk --target dist/
```

产物位于 `dist/` 目录。

### 方法二：放入 OpenWrt / ImmortalWrt feed

如果你需要从 OpenWrt 源码树编译标准的 `.ipk`：

1. 把本仓库复制到 OpenWrt 源码树的 feed 目录：

```bash
cp -r /path/to/luci-app-nook openwrt/feeds/luci/applications/luci-app-nook
```

2. 更新 feeds 并编译：

```bash
cd openwrt
./scripts/feeds update luci
./scripts/feeds install luci-app-nook
make menuconfig  # 选择 LuCI -> Applications -> luci-app-nook
make package/luci-app-nook/compile V=s
```

### 通过 Git tag 发布

只有推送 `v*` 开头的 tag 时才会触发 CI 构建。

推送形如 `v1.2.3` 的 tag 时，CI 会自动：

1. 以 tag 名称作为版本号构建 nFPM 包（`v1.2.3` 会去掉前缀 `v`，产物如 `luci-app-nook_1.2.3-1_amd64.deb`）；
2. 将编译产物上传到该 tag 对应的 GitHub Release（不存在则自动创建）。

```bash
git tag v1.2.3
git push origin v1.2.3
```

### 测试 CI

**方式一：手动触发（推荐日常调试）**

进入仓库的 **Actions → CI → Run workflow**，可以手动运行 workflow，并输入一个测试版本号（如 `9.9.9-test`）。这种方式不会创建 Release。

**方式二：推送测试 tag**

```bash
git tag v0.0.0-test.1
git push origin v0.0.0-test.1
```

构建完成后可以删除该 tag 和对应的 Release：

```bash
git push --delete origin v0.0.0-test.1
git tag -d v0.0.0-test.1
```

## 本地语法检查

```bash
# JavaScript
node --check htdocs/luci-static/resources/view/nook/general.js

# ucode（需要安装 ucode）
ucode -c root/usr/share/rpcd/ucode/nook.uc
```

## 目录结构

```
luci-app-nook/
├── Makefile                 # 占位：标准 LuCI Makefile，当前未用于打包
├── nfpm.yaml
├── scripts/build-packages.sh
├── packaging/scripts/postinstall.sh
├── htdocs/luci-static/resources/view/nook/general.js
├── po/templates/nook.pot
├── root/usr/share/luci/menu.d/luci-app-nook.json
├── root/usr/share/rpcd/acl.d/luci-app-nook.json
└── root/usr/share/rpcd/ucode/nook.uc
```

> **注意**：`Makefile` 目前仅为标准 LuCI 应用结构占位，尚未通过 OpenWrt SDK/feed 实际验证可用。当前发布打包使用 `nfpm.yaml` + `scripts/build-packages.sh`。

## 截图

_（待补充）_

## 许可

[MIT](LICENSE)
