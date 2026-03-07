#!/bin/bash
# 详细测试执行脚本

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          太平年连连看 - 详细测试执行                       ║"
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

pass_count=0
fail_count=0
warn_count=0

test_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((pass_count++))
}

test_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((fail_count++))
}

test_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((warn_count++))
}

test_info() {
    echo -e "${BLUE}ℹ INFO${NC}: $1"
}

# ========== 测试开始 ==========

echo "【测试1】项目文件完整性检查"
echo "─────────────────────────────────────────────"

REQUIRED_FILES=(
    "app.json"
    "app.js"
    "app.wxss"
    "project.config.json"
    "js/LinkUpGame.js"
    "js/TaiPingCharacters.js"
    "pages/index/index.js"
    "pages/index/index.wxml"
    "pages/index/index.wxss"
    "pages/game/game.js"
    "pages/game/game.wxml"
    "pages/game/game.wxss"
    "pages/characters/characters.js"
    "pages/characters/characters.wxml"
    "pages/characters/characters.wxss"
    "pages/result/result.js"
    "pages/result/result.wxml"
    "pages/result/result.wxss"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        test_pass "文件存在: $file"
    else
        test_fail "文件缺失: $file"
    fi
done

echo ""
echo "【测试2】小程序配置文件验证"
echo "─────────────────────────────────────────────"

# 检查app.json
if grep -q '"pages"' app.json && \
   grep -q 'pages/index/index' app.json && \
   grep -q 'pages/game/game' app.json && \
   grep -q 'pages/characters/characters' app.json; then
    test_pass "app.json 页面配置正确"
else
    test_fail "app.json 页面配置错误"
fi

if grep -q '"navigationBarTitleText"' app.json; then
    test_pass "app.json 导航栏标题配置正确"
else
    test_warn "app.json 导航栏标题配置缺失"
fi

echo ""
echo "【测试3】图片资源检查"
echo "─────────────────────────────────────────────"

# 检查实际图片文件
IMAGE_FILES=($(ls images/*.png 2>/dev/null | grep -v "^l" | grep -v "char" | wc -l))
if [ "$IMAGE_FILES" -ge 12 ]; then
    test_pass "图片文件数量正确: $IMAGE_FILES 张"
else
    test_fail "图片文件数量不足: $IMAGE_FILES 张 (需要12张)"
fi

# 检查快捷方式
SYMLINK_COUNT=$(ls -l images/char*.png 2>/dev/null | wc -l)
if [ "$SYMLINK_COUNT" -eq 12 ]; then
    test_pass "图片快捷方式数量正确: 12个"
else
    test_fail "图片快捷方式数量错误: $SYMLINK_COUNT (应为12)"
fi

# 检查图片大小
OVERSIZE_COUNT=0
for img in images/*.png; do
    if [ -f "$img" ] && [ ! -L "$img" ]; then
        SIZE=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        SIZE_KB=$((SIZE / 1024))
        if [ "$SIZE_KB" -gt 200 ]; then
            ((OVERSIZE_COUNT++))
        fi
    fi
done

if [ "$OVERSIZE_COUNT" -eq 0 ]; then
    test_pass "所有图片大小正常 (<200KB)"
else
    test_warn "$OVERSIZE_COUNT 张图片过大 (>200KB)"
fi

# 检查总大小
TOTAL_SIZE=$(du -sk images/ | awk '{print $1}')
if [ "$TOTAL_SIZE" -lt 2000 ]; then
    test_pass "图片总大小合理: ${TOTAL_SIZE}KB"
else
    test_warn "图片总大小较大: ${TOTAL_SIZE}KB"
fi

echo ""
echo "【测试4】JavaScript 语法检查"
echo "─────────────────────────────────────────────"

# 检查关键JS文件语法
JS_FILES=("js/LinkUpGame.js" "js/TaiPingCharacters.js")
for js in "${JS_FILES[@]}"; do
    if node --check "$js" 2>/dev/null; then
        test_pass "语法正确: $js"
    else
        test_fail "语法错误: $js"
    fi
done

echo ""
echo "【测试5】角色数据验证"
echo "─────────────────────────────────────────────"

# 使用node验证角色数据
node -e "
const fs = require('fs');
const content = fs.readFileSync('js/TaiPingCharacters.js', 'utf8');

// 提取所有角色对象
const charMatches = content.match(/\{[\s\S]*?name:[\s\S]*?\}/g);
if (charMatches && charMatches.length >= 12) {
    console.log('✓ PASS: 角色数据格式正确，共 ' + charMatches.length + ' 个角色');
    process.exit(0);
} else {
    console.log('✗ FAIL: 角色数据格式异常');
    process.exit(1);
}
" 2>&1 | while read line; do
    if echo "$line" | grep -q "PASS"; then
        test_pass "角色数据结构完整"
    elif echo "$line" | grep -q "FAIL"; then
        test_fail "角色数据结构异常"
    fi
done

# 检查图片路径
node -e "
const fs = require('fs');
const content = fs.readFileSync('js/TaiPingCharacters.js', 'utf8');
const imagePaths = content.match(/image:\s*'([^']+)'/g);
if (imagePaths && imagePaths.length === 12) {
    console.log('✓ PASS: 图片路径配置正确 (12个)');
} else {
    console.log('✗ FAIL: 图片路径配置错误 (' + (imagePaths ? imagePaths.length : 0) + '个)');
}
" 2>&1 | while read line; do
    if echo "$line" | grep -q "PASS"; then
        test_pass "角色图片路径配置正确"
    elif echo "$line" | grep -q "FAIL"; then
        test_fail "角色图片路径配置错误"
    fi
done

echo ""
echo "【测试6】项目配置检查"
echo "─────────────────────────────────────────────"

# 检查project.config.json
if [ -f "project.config.json" ]; then
    if grep -q '"appid"' project.config.json; then
        test_pass "project.config.json 包含appid配置"
    else
        test_warn "project.config.json 缺少appid配置"
    fi
    
    if grep -q '"compileType"' project.config.json || grep -q '"libVersion"' project.config.json; then
        test_pass "project.config.json 编译配置正确"
    else
        test_warn "project.config.json 编译配置可能不完整"
    fi
else
    test_fail "project.config.json 不存在"
fi

echo ""
echo "【测试7】微信开发者工具检查"
echo "─────────────────────────────────────────────"

DEVTOOLS_PATH="/Applications/微信开发者工具.app"
DEVTOOLS_PATH_EN="/Applications/wechatwebdevtools.app"

if [ -d "$DEVTOOLS_PATH" ] || [ -d "$DEVTOOLS_PATH_EN" ]; then
    test_pass "微信开发者工具已安装"
    
    # 尝试获取版本
    PLIST_PATH="$DEVTOOLS_PATH/Contents/Info.plist"
    if [ -f "$PLIST_PATH" ]; then
        VERSION=$(defaults read "$PLIST_PATH" CFBundleShortVersionString 2>/dev/null || echo "未知")
        test_info "开发者工具版本: $VERSION"
    fi
else
    test_fail "微信开发者工具未安装"
    test_info "请访问 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html 下载安装"
fi

echo ""
echo "【测试8】启动测试服务器"
echo "─────────────────────────────────────────────"

TEST_PORT=8090
if lsof -Pi :$TEST_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    test_pass "测试服务器已在运行 (端口 $TEST_PORT)"
else
    python3 -m http.server $TEST_PORT > /dev/null 2>&1 &
    sleep 2
    if lsof -Pi :$TEST_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        test_pass "测试服务器启动成功 (端口 $TEST_PORT)"
    else
        test_fail "测试服务器启动失败"
    fi
fi

test_info "测试服务器地址: http://localhost:$TEST_PORT"

echo ""
echo "【测试9】文件路径验证"
echo "─────────────────────────────────────────────"

# 检查角色图片路径是否正确配置
node -e "
const fs = require('fs');
const content = fs.readFileSync('js/TaiPingCharacters.js', 'utf8');
const images = content.match(/image:\s*'([^']+)'/g) || [];
let allValid = true;
images.forEach(img => {
    const path = img.match(/'([^']+)'/)[1];
    if (!path.startsWith('/images/')) {
        console.log('无效路径: ' + path);
        allValid = false;
    }
});
if (allValid && images.length > 0) {
    console.log('VALID');
} else {
    console.log('INVALID');
}
" 2>&1 | grep -q "VALID" && test_pass "所有图片路径格式正确" || test_fail "图片路径格式有误"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                      测试完成                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "测试结果统计:"
echo "  ${GREEN}通过: $pass_count${NC}"
echo "  ${RED}失败: $fail_count${NC}"
echo "  ${YELLOW}警告: $warn_count${NC}"
echo ""

if [ "$fail_count" -eq 0 ]; then
    echo -e "${GREEN}✓ 所有关键测试通过！项目可以导入微信开发者工具进行测试。${NC}"
    echo ""
    echo "下一步操作:"
    echo "  1. 打开微信开发者工具"
    echo "  2. 点击「导入项目」"
    echo "  3. 选择目录: $PROJECT_DIR"
    echo "  4. AppID 选择「使用测试号」"
    echo "  5. 点击「确定」"
    echo ""
    echo "浏览器预览: http://localhost:$TEST_PORT/模拟测试.html"
    exit 0
else
    echo -e "${RED}✗ 存在失败的测试，请修复后再进行导入。${NC}"
    exit 1
fi
