#!/bin/bash
#
# 微信开发者工具安装助手
# 适用于 macOS ARM64 (Apple Silicon)
#

echo "=========================================="
echo "  微信开发者工具安装助手"
echo "=========================================="
echo ""

# 检查系统
ARCH=$(uname -m)
if [ "$ARCH" != "arm64" ]; then
    echo "⚠️  提示：当前系统是 $ARCH，将下载 Intel 版本"
    echo "   （可通过 Rosetta 运行）"
else
    echo "✅ 检测到 Apple Silicon (ARM64)"
fi

echo ""
echo "📥 下载地址:"
echo "   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
echo ""
echo "📋 安装步骤:"
echo ""
echo "1. 点击上方链接，访问官方下载页面"
echo "2. 下载 macOS 稳定版 (Stable Build)"
echo "   文件名类似: wechat_devtools_1.06.xxx.dmg"
echo ""
echo "3. 打开下载的 DMG 文件"
echo "4. 将 '微信开发者工具' 拖到 Applications 文件夹"
echo ""
echo "5. 首次运行可能需要:"
echo "   - 右键点击应用 → 打开"
echo "   - 或在 系统设置 → 隐私与安全性 中允许"
echo ""
echo "6. 使用微信扫码登录"
echo ""

# 检查是否已安装
if [ -d "/Applications/微信开发者工具.app" ]; then
    echo "✅ 检测到微信开发者工具已安装"
    echo ""
    echo "🚀 启动命令:"
    echo "   open '/Applications/微信开发者工具.app'"
    echo ""
    echo "是否现在启动? (y/n)"
    read -n 1 answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo ""
        echo "正在启动..."
        open '/Applications/微信开发者工具.app'
    fi
else
    echo "⬜ 微信开发者工具未安装"
    echo ""
    echo "💡 快捷下载命令（复制到终端执行）:"
    echo ""
    
    # 获取最新版本号（如果可能）
    echo "   # 方法1: 使用 curl 下载（可能不是最新版）"
    echo "   cd ~/Downloads"
    echo "   curl -L -o wechat_devtools.dmg 'https://servicewechat.com/wxa-dev-logic/download_redirect?type=x64&from=mpwiki'"
    echo "   open wechat_devtools.dmg"
    echo ""
    echo "   # 方法2: 使用 wget"
    echo "   cd ~/Downloads"
    echo "   wget -O wechat_devtools.dmg 'https://servicewechat.com/wxa-dev-logic/download_redirect?type=x64&from=mpwiki'"
    echo "   open wechat_devtools.dmg"
    echo ""
    echo "   # 方法3: 手动下载（推荐）"
    echo "   open https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
fi

echo ""
echo "=========================================="
echo "📱 安装完成后导入项目:"
echo "=========================================="
echo ""
echo "1. 点击 '导入项目'"
echo "2. 目录: ~/peace-llk/"
echo "3. AppID: 使用测试号"
echo "4. 点击 '确定'"
echo ""
echo "✅ 项目位置: ~/peace-llk/"
echo ""
