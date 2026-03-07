#!/bin/bash

echo "========================================"
echo "  太平年连连看 - 微信开发者工具测试助手"
echo "========================================"
echo ""

# 检查项目目录
PROJECT_DIR="$HOME/peace-llk"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误：项目目录不存在: $PROJECT_DIR"
    exit 1
fi

echo "✅ 项目目录: $PROJECT_DIR"
echo ""

# 检查关键文件
echo "📁 检查项目文件..."
FILES=(
    "app.json"
    "app.js"
    "app.wxss"
    "project.config.json"
    "js/LinkUpGame.js"
    "js/TaiPingCharacters.js"
    "pages/index/index.wxml"
    "pages/index/index.js"
    "pages/game/game.wxml"
    "pages/game/game.js"
    "pages/characters/characters.wxml"
    "pages/characters/characters.js"
)

ALL_EXISTS=true
for file in "${FILES[@]}"; do
    if [ -f "$PROJECT_DIR/$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        ALL_EXISTS=false
    fi
done

echo ""

# 检查图片文件
echo "🖼️  检查图片资源..."
IMAGE_COUNT=$(ls -1 "$PROJECT_DIR/images"/char*.png 2>/dev/null | wc -l)
echo "  找到 $IMAGE_COUNT 个角色图片"

if [ "$IMAGE_COUNT" -eq 12 ]; then
    echo "  ✅ 图片数量正确 (12张)"
else
    echo "  ⚠️  图片数量不正确 (应为12张)"
fi

# 检查图片大小
echo ""
echo "📊 图片大小检查..."
TOTAL_SIZE=$(du -sh "$PROJECT_DIR/images" | awk '{print $1}')
echo "  图片总大小: $TOTAL_SIZE"

# 列出前5张图片的大小
ls -lh "$PROJECT_DIR/images"/*.png 2>/dev/null | grep -v "^l" | head -5 | awk '{print "  - " $9 ": " $5}'

echo ""

# 启动本地服务器测试
echo "🌐 启动本地测试服务器..."
echo "  地址: http://localhost:8090"
echo ""

# 检查端口是否被占用
if lsof -Pi :8090 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ✅ 服务器已在运行 (端口 8090)"
else
    echo "  🚀 启动服务器..."
    cd "$PROJECT_DIR" && python3 -m http.server 8090 > /dev/null 2>&1 &
    sleep 2
    echo "  ✅ 服务器已启动"
fi

echo ""
echo "========================================"
echo "📱 微信开发者工具测试步骤:"
echo "========================================"
echo ""
echo "1. 打开 微信开发者工具"
echo "2. 点击 「导入项目」"
echo "3. 选择目录: $PROJECT_DIR"
echo "4. AppID 选择 「使用测试号」"
echo "5. 点击 「确定」"
echo ""
echo "🧪 测试检查项:"
echo "   ✅ 首页显示正常"
echo "   ✅ 角色图鉴显示12个角色"
echo "   ✅ 三种难度可正常游戏"
echo "   ✅ 角色图片能正常加载"
echo "   ✅ 消除逻辑正确"
echo "   ✅ 道具功能可用"
echo ""
echo "📖 详细测试清单: $PROJECT_DIR/测试清单.md"
echo ""
echo "========================================"
echo "按任意键在浏览器中打开测试页面..."
read -n 1

open "http://localhost:8090/test.html"
