#!/bin/bash
#
# 完整的测试套件 - 检查环境、启动服务、运行测试
#

echo "╔════════════════════════════════════════════════╗"
echo "║     太平年连连看 - 完整测试套件                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="$HOME/peace-llk"
TEST_PORT=8090

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# ========== 1. 环境检查 ==========
echo "📋 第一步：环境检查"
echo "─────────────────────────────────────────"

# 检查项目目录
if [ -d "$PROJECT_DIR" ]; then
    check_pass "项目目录存在"
else
    check_fail "项目目录不存在: $PROJECT_DIR"
    exit 1
fi

# 检查关键文件
FILES=(
    "app.json"
    "app.js"
    "js/LinkUpGame.js"
    "js/TaiPingCharacters.js"
    "pages/index/index.wxml"
    "pages/game/game.js"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$PROJECT_DIR/$file" ]; then
        check_pass "文件存在: $file"
    else
        check_fail "文件缺失: $file"
        ALL_FILES_EXIST=false
    fi
done

echo ""

# ========== 2. 图片资源检查 ==========
echo "🖼️  第二步：图片资源检查"
echo "─────────────────────────────────────────"

IMAGE_COUNT=$(ls -1 "$PROJECT_DIR/images"/char*.png 2>/dev/null | wc -l)
if [ "$IMAGE_COUNT" -eq 12 ]; then
    check_pass "图片数量正确: 12张"
else
    check_fail "图片数量错误: $IMAGE_COUNT (应为12)"
fi

# 检查图片大小
TOTAL_SIZE=$(du -sk "$PROJECT_DIR/images" | awk '{print $1}')
if [ "$TOTAL_SIZE" -lt 1000 ]; then
    check_pass "图片总大小: ${TOTAL_SIZE}KB (符合要求)"
else
    check_warn "图片总大小: ${TOTAL_SIZE}KB (建议压缩)"
fi

# 检查单个图片
SINGLE_SIZE_OK=true
for img in "$PROJECT_DIR/images"/*.png; do
    if [ -f "$img" ] && [ ! -L "$img" ]; then
        SIZE=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        SIZE_KB=$((SIZE / 1024))
        if [ "$SIZE_KB" -gt 100 ]; then
            check_warn "图片过大: $(basename $img) (${SIZE_KB}KB)"
            SINGLE_SIZE_OK=false
        fi
    fi
done

if [ "$SINGLE_SIZE_OK" = true ]; then
    check_pass "所有图片大小正常 (<100KB)"
fi

echo ""

# ========== 3. 微信开发者工具检查 ==========
echo "🔧 第三步：微信开发者工具检查"
echo "─────────────────────────────────────────"

DEVTOOLS_PATH="/Applications/微信开发者工具.app"
DEVTOOLS_PATH_EN="/Applications/wechatwebdevtools.app"

if [ -d "$DEVTOOLS_PATH" ] || [ -d "$DEVTOOLS_PATH_EN" ]; then
    check_pass "微信开发者工具已安装"
    DEVTOOLS_INSTALLED=true
else
    check_fail "微信开发者工具未安装"
    DEVTOOLS_INSTALLED=false
    echo ""
    echo "💡 安装方法:"
    echo "   1. 访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html"
    echo "   2. 下载 macOS 版本"
    echo "   3. 安装到 Applications 文件夹"
    echo ""
fi

echo ""

# ========== 4. 启动测试服务器 ==========
echo "🌐 第四步：启动测试服务器"
echo "─────────────────────────────────────────"

# 检查端口
if lsof -Pi :$TEST_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    check_pass "测试服务器已在运行 (端口 $TEST_PORT)"
else
    echo "🚀 启动测试服务器..."
    cd "$PROJECT_DIR" && python3 -m http.server $TEST_PORT > /dev/null 2>&1 &
    sleep 2
    
    if lsof -Pi :$TEST_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        check_pass "测试服务器启动成功"
    else
        check_fail "测试服务器启动失败"
    fi
fi

echo "   测试地址: http://localhost:$TEST_PORT"
echo ""

# ========== 5. 运行自动化测试 ==========
echo "🧪 第五步：浏览器模拟测试"
echo "─────────────────────────────────────────"

echo "正在打开浏览器模拟测试..."
sleep 1
open "http://localhost:$TEST_PORT/模拟测试.html"
check_pass "浏览器模拟测试已启动"

echo ""

# ========== 6. 生成测试报告 ==========
echo "📊 测试报告摘要"
echo "═════════════════════════════════════════"
echo ""
echo "项目路径: $PROJECT_DIR"
echo "代码文件: $(find "$PROJECT_DIR" -name "*.js" -o -name "*.wxml" -o -name "*.wxss" | wc -l) 个"
echo "图片资源: $IMAGE_COUNT 张"
echo "图片大小: $(du -sh "$PROJECT_DIR/images" | awk '{print $1}')"
echo "测试端口: $TEST_PORT"
echo ""

if [ "$DEVTOOLS_INSTALLED" = true ]; then
    echo -e "${GREEN}✓ 可以进行微信开发者工具测试${NC}"
    echo ""
    echo "下一步操作:"
    echo "   1. 打开 微信开发者工具"
    echo "   2. 导入项目: $PROJECT_DIR"
    echo "   3. 使用测试号运行"
    echo "   4. 参考 测试清单.md 进行完整测试"
    echo ""
    
    # 询问是否启动开发者工具
    echo -n "是否现在启动微信开发者工具? (y/n): "
    read -n 1 answer
    echo ""
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        if [ -d "$DEVTOOLS_PATH" ]; then
            open "$DEVTOOLS_PATH"
        else
            open "$DEVTOOLS_PATH_EN"
        fi
    fi
else
    echo -e "${YELLOW}⚠ 请先安装微信开发者工具${NC}"
    echo ""
    echo "安装命令:"
    echo "   bash $PROJECT_DIR/install-devtools.sh"
fi

echo ""
echo "═════════════════════════════════════════"
echo ""
echo "📚 测试文档:"
echo "   - 快速测试: $PROJECT_DIR/快速测试.md"
echo "   - 测试清单: $PROJECT_DIR/测试清单.md"
echo "   - 测试报告: $PROJECT_DIR/测试报告模板.md"
echo ""
echo "🌐 浏览器测试: http://localhost:$TEST_PORT/模拟测试.html"
echo ""
