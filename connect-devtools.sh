#!/bin/bash
#
# 微信开发者工具连接助手
# 检查项目配置并提供连接指导
#

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     微信开发者工具连接助手                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="$HOME/peace-llk"
cd "$PROJECT_DIR"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "📂 项目目录: $PROJECT_DIR"
echo ""

# ========== 1. 检查必需文件 ==========
echo "【1/5】检查必需文件..."
echo "─────────────────────────────────────────────"

REQUIRED_FILES=(
    "app.json"
    "app.js"
    "app.wxss"
    "game.json"
    "project.config.json"
    "sitemap.json"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (缺失!)"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = false ]; then
    echo ""
    echo -e "${RED}✗ 存在缺失文件，请修复后再导入${NC}"
    exit 1
fi

echo ""

# ========== 2. 检查配置文件 ==========
echo "【2/5】验证配置文件..."
echo "─────────────────────────────────────────────"

# 检查 app.json
if grep -q '"pages"' app.json; then
    PAGE_COUNT=$(grep -o '"pages/[^"]*"' app.json | wc -l)
    echo -e "${GREEN}✓${NC} app.json 包含 $PAGE_COUNT 个页面配置"
else
    echo -e "${RED}✗${NC} app.json 缺少 pages 配置"
fi

# 检查 game.json
if [ -f "game.json" ]; then
    echo -e "${GREEN}✓${NC} game.json 存在"
else
    echo -e "${YELLOW}⚠${NC} game.json 不存在 (创建中...)"
    echo "{}" > game.json
fi

# 检查 project.config.json
if grep -q '"appid"' project.config.json; then
    APPID=$(grep -o '"appid": "[^"]*"' project.config.json | cut -d'"' -f4)
    if [ "$APPID" = "wxtestappid" ] || [ -z "$APPID" ]; then
        echo -e "${YELLOW}⚠${NC} project.config.json 使用测试号 appid"
    else
        echo -e "${GREEN}✓${NC} project.config.json appid: $APPID"
    fi
else
    echo -e "${RED}✗${NC} project.config.json 缺少 appid"
fi

echo ""

# ========== 3. 检查资源文件 ==========
echo "【3/5】检查资源文件..."
echo "─────────────────────────────────────────────"

IMAGE_COUNT=$(ls images/char*.png 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -ge 11 ]; then
    echo -e "${GREEN}✓${NC} 图片资源: $IMAGE_COUNT 张"
else
    echo -e "${RED}✗${NC} 图片资源不足: $IMAGE_COUNT 张 (需要11张)"
fi

JS_FILES=$(find . -name "*.js" -not -path "./node_modules/*" | wc -l)
echo -e "${GREEN}✓${NC} JavaScript 文件: $JS_FILES 个"

echo ""

# ========== 4. 验证 JSON 格式 ==========
echo "【4/5】验证 JSON 格式..."
echo "─────────────────────────────────────────────"

JSON_FILES=("app.json" "game.json" "project.config.json" "sitemap.json")
JSON_VALID=true

for json in "${JSON_FILES[@]}"; do
    if [ -f "$json" ]; then
        if python3 -c "import json; json.load(open('$json'))" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $json 格式正确"
        else
            echo -e "${RED}✗${NC} $json 格式错误"
            JSON_VALID=false
        fi
    fi
done

if [ "$JSON_VALID" = false ]; then
    echo ""
    echo -e "${RED}✗ 存在 JSON 格式错误，请修复${NC}"
    exit 1
fi

echo ""

# ========== 5. 生成连接指南 ==========
echo "【5/5】连接指南"
echo "════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✓ 项目检查通过，可以导入微信开发者工具！${NC}"
echo ""
echo "📱 连接步骤:"
echo ""
echo "  1️⃣  打开微信开发者工具"
echo "       open '/Applications/微信开发者工具.app'"
echo ""
echo "  2️⃣  点击 '导入项目' (或 '+' 按钮)"
echo ""
echo "  3️⃣  填写项目信息:"
echo "       • 目录: $PROJECT_DIR"
echo "       • AppID: 选择 '使用测试号'"
echo "       • 项目名称: 太平年连连看"
echo ""
echo "  4️⃣  点击 '确定' 导入"
echo ""
echo "  5️⃣  等待编译完成 (约10-30秒)"
echo ""
echo "🔧 如果导入失败:"
echo ""
echo "  方案A - 清除缓存重新导入:"
echo "       1. 删除现有项目（右键 → 删除项目）"
echo "       2. 点击 '清缓存' → '全部清除'"
echo "       3. 重新导入"
echo ""
echo "  方案B - 检查错误信息:"
echo "       1. 查看 Console 面板的具体错误"
echo "       2. 根据错误提示修复问题"
echo "       3. 点击 '编译' 按钮重新编译"
echo ""
echo "📋 测试检查清单:"
echo ""
echo "  ☐ 首页显示正常 (紫色背景、标题、按钮)"
echo "  ☐ 角色图鉴显示11个角色"
echo "  ☐ 游戏页面4×4/6×6格子正常"
echo "  ☐ 角色图片加载正常 (无裂图)"
echo "  ☐ 消除逻辑正确 (0/1/2个拐角)"
echo "  ☐ 提示/重排/暂停功能可用"
echo "  ☐ Console 无红色错误"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# 询问是否打开开发者工具
echo -n "是否现在打开微信开发者工具? (y/n): "
read -n 1 answer
echo ""

if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
    DEVTOOLS_PATH="/Applications/微信开发者工具.app"
    if [ -d "$DEVTOOLS_PATH" ]; then
        echo "正在启动微信开发者工具..."
        open "$DEVTOOLS_PATH"
    else
        echo -e "${RED}未找到微信开发者工具${NC}"
        echo "请从 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html 下载安装"
    fi
fi

echo ""
echo "✅ 检查完成！"
