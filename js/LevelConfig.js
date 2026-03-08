/**
 * 关卡配置系统
 * 难度从1-100，1最简单、100最难
 * 全部100关
 *
 * 难度阶梯设计：
 *   第1-10关：新手入门（2×4 → 8×8，提示充裕）
 *   第11-20关：初级挑战（4×4 → 6×6，时间渐紧）
 *   第21-30关：中级进阶（4×6 → 6×8，提示减少）
 *   第31-40关：高手之路（6×6 → 8×8，时间更短）
 *   第41-50关：精英突破（6×8 → 8×8，提示/重排稀缺）
 *   第51-60关：大师考验（6×8 → 8×10，限制极严）
 *   第61-70关：宗师境界（8×8 → 8×10，极限时间）
 *   第71-80关：传说之路（8×8 → 10×10，近乎无提示）
 *   第81-90关：神话挑战（8×10 → 10×10，极限挑战）
 *   第91-100关：登峰造极（10×10 → 10×12，地狱难度）
 */

/**
 * 关卡配置项：
 * - level: 关卡编号
 * - name: 关卡名称
 * - rows: 行数
 * - cols: 列数
 * - pairCount: 卡牌对数（可选，省略表示铺满 rows×cols/2 对）
 * - timeLimit: 时间限制（秒）
 * - imageCount: 使用的角色图片种类数（1-11）
 * - hintCount: 可用提示次数（-1表示无限）
 * - shuffleCount: 可用重排次数（-1表示无限）
 * - starScores: [一星分数线, 二星分数线, 三星分数线]
 */
const LEVELS = [
  // ============ 第1-10关：新手入门 ============
  // pairCount: 卡牌对数（省略或0表示铺满整个棋盘）
  { level: 1,  name: '初出茅庐', rows: 4, cols: 6, pairCount: 4,  timeLimit: 120, imageCount: 4,  hintCount: -1, shuffleCount: -1, starScores: [10, 30, 50] },
  { level: 2,  name: '小试牛刀', rows: 4, cols: 6, pairCount: 6,  timeLimit: 120, imageCount: 6,  hintCount: -1, shuffleCount: -1, starScores: [20, 50, 80] },
  { level: 3,  name: '崭露头角', rows: 4, cols: 6, pairCount: 8,  timeLimit: 100, imageCount: 8,  hintCount: 5,  shuffleCount: -1, starScores: [30, 70, 110] },
  { level: 4,  name: '渐入佳境', rows: 4, cols: 6, pairCount: 10, timeLimit: 90,  imageCount: 8,  hintCount: 5,  shuffleCount: 5,  starScores: [40, 80, 130] },
  { level: 5,  name: '身经百战', rows: 6, cols: 6, pairCount: 12, timeLimit: 120, imageCount: 10, hintCount: 4,  shuffleCount: 4,  starScores: [50, 100, 160] },
  { level: 6,  name: '出类拔萃', rows: 6, cols: 6, pairCount: 14, timeLimit: 100, imageCount: 11, hintCount: 3,  shuffleCount: 3,  starScores: [60, 120, 190] },
  { level: 7,  name: '炉火纯青', rows: 6, cols: 6,               timeLimit: 150, imageCount: 11, hintCount: 3,  shuffleCount: 3,  starScores: [80, 160, 250] },
  { level: 8,  name: '登峰造极', rows: 6, cols: 6,               timeLimit: 120, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [100, 200, 300] },
  { level: 9,  name: '所向披靡', rows: 6, cols: 8,               timeLimit: 150, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [120, 240, 380] },
  { level: 10, name: '天下无双', rows: 8, cols: 8,               timeLimit: 180, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [150, 300, 480] },

  // ============ 第11-20关：初级挑战 ============
  { level: 11, name: '风起云涌', rows: 4, cols: 4, timeLimit: 70,  imageCount: 8,  hintCount: 4,  shuffleCount: 4,  starScores: [40, 90, 140] },
  { level: 12, name: '暗流涌动', rows: 4, cols: 4, timeLimit: 60,  imageCount: 8,  hintCount: 4,  shuffleCount: 3,  starScores: [45, 100, 155] },
  { level: 13, name: '群雄逐鹿', rows: 4, cols: 6, timeLimit: 100, imageCount: 10, hintCount: 4,  shuffleCount: 3,  starScores: [55, 110, 175] },
  { level: 14, name: '逐鹿中原', rows: 4, cols: 6, timeLimit: 90,  imageCount: 10, hintCount: 3,  shuffleCount: 3,  starScores: [60, 125, 195] },
  { level: 15, name: '烽火连天', rows: 4, cols: 6, timeLimit: 80,  imageCount: 11, hintCount: 3,  shuffleCount: 3,  starScores: [65, 135, 210] },
  { level: 16, name: '兵临城下', rows: 6, cols: 6, timeLimit: 140, imageCount: 11, hintCount: 3,  shuffleCount: 3,  starScores: [85, 170, 265] },
  { level: 17, name: '运筹帷幄', rows: 6, cols: 6, timeLimit: 130, imageCount: 11, hintCount: 3,  shuffleCount: 2,  starScores: [90, 180, 280] },
  { level: 18, name: '决胜千里', rows: 6, cols: 6, timeLimit: 120, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [100, 200, 310] },
  { level: 19, name: '势如破竹', rows: 6, cols: 6, timeLimit: 110, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [105, 210, 330] },
  { level: 20, name: '横扫千军', rows: 6, cols: 6, timeLimit: 100, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [110, 225, 350] },

  // ============ 第21-30关：中级进阶 ============
  { level: 21, name: '问鼎天下', rows: 4, cols: 6, timeLimit: 70,  imageCount: 11, hintCount: 3,  shuffleCount: 2,  starScores: [70, 140, 220] },
  { level: 22, name: '龙争虎斗', rows: 4, cols: 8, timeLimit: 100, imageCount: 11, hintCount: 3,  shuffleCount: 2,  starScores: [80, 160, 250] },
  { level: 23, name: '虎踞龙盘', rows: 4, cols: 8, timeLimit: 90,  imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [85, 175, 270] },
  { level: 24, name: '金戈铁马', rows: 6, cols: 6, timeLimit: 90,  imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [110, 220, 345] },
  { level: 25, name: '铁马冰河', rows: 6, cols: 6, timeLimit: 80,  imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [115, 235, 365] },
  { level: 26, name: '沙场秋点', rows: 6, cols: 8, timeLimit: 140, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [130, 260, 410] },
  { level: 27, name: '马革裹尸', rows: 6, cols: 8, timeLimit: 130, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [135, 275, 430] },
  { level: 28, name: '血战到底', rows: 6, cols: 8, timeLimit: 120, imageCount: 11, hintCount: 2,  shuffleCount: 1,  starScores: [140, 285, 445] },
  { level: 29, name: '背水一战', rows: 6, cols: 8, timeLimit: 110, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [145, 295, 460] },
  { level: 30, name: '破釜沉舟', rows: 6, cols: 8, timeLimit: 100, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [150, 305, 480] },

  // ============ 第31-40关：高手之路 ============
  { level: 31, name: '将门虎子', rows: 6, cols: 6, timeLimit: 75,  imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [120, 240, 375] },
  { level: 32, name: '千军万马', rows: 6, cols: 8, timeLimit: 110, imageCount: 11, hintCount: 2,  shuffleCount: 1,  starScores: [140, 280, 440] },
  { level: 33, name: '纵横捭阖', rows: 6, cols: 8, timeLimit: 100, imageCount: 11, hintCount: 2,  shuffleCount: 1,  starScores: [145, 295, 460] },
  { level: 34, name: '乘风破浪', rows: 8, cols: 8, timeLimit: 170, imageCount: 11, hintCount: 2,  shuffleCount: 2,  starScores: [160, 325, 510] },
  { level: 35, name: '披荆斩棘', rows: 8, cols: 8, timeLimit: 160, imageCount: 11, hintCount: 2,  shuffleCount: 1,  starScores: [165, 335, 525] },
  { level: 36, name: '一马当先', rows: 8, cols: 8, timeLimit: 150, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [170, 345, 540] },
  { level: 37, name: '过五关斩', rows: 8, cols: 8, timeLimit: 140, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [175, 355, 555] },
  { level: 38, name: '万夫莫敌', rows: 8, cols: 8, timeLimit: 130, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [180, 365, 570] },
  { level: 39, name: '战无不胜', rows: 8, cols: 8, timeLimit: 120, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [185, 375, 585] },
  { level: 40, name: '攻无不克', rows: 8, cols: 8, timeLimit: 110, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [190, 385, 600] },

  // ============ 第41-50关：精英突破 ============
  { level: 41, name: '虎啸风生', rows: 6, cols: 8, timeLimit: 85,  imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [155, 315, 490] },
  { level: 42, name: '龙腾四海', rows: 6, cols: 8, timeLimit: 80,  imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [160, 325, 505] },
  { level: 43, name: '凤舞九天', rows: 8, cols: 8, timeLimit: 120, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [190, 385, 600] },
  { level: 44, name: '鹏程万里', rows: 8, cols: 8, timeLimit: 110, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [195, 395, 620] },
  { level: 45, name: '扶摇直上', rows: 8, cols: 8, timeLimit: 100, imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [200, 405, 635] },
  { level: 46, name: '一飞冲天', rows: 8, cols: 8, timeLimit: 95,  imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [205, 415, 650] },
  { level: 47, name: '气吞山河', rows: 8, cols: 8, timeLimit: 90,  imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [210, 425, 665] },
  { level: 48, name: '壮志凌云', rows: 8, cols: 8, timeLimit: 85,  imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [215, 435, 680] },
  { level: 49, name: '叱咤风云', rows: 8, cols: 8, timeLimit: 80,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [220, 445, 695] },
  { level: 50, name: '半百征途', rows: 8, cols: 8, timeLimit: 75,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [225, 455, 710] },

  // ============ 第51-60关：大师考验 ============
  { level: 51, name: '大师之路', rows: 6, cols: 8, timeLimit: 75,  imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [160, 325, 510] },
  { level: 52, name: '棋高一着', rows: 6, cols: 10, timeLimit: 120, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [175, 350, 550] },
  { level: 53, name: '高瞻远瞩', rows: 6, cols: 10, timeLimit: 110, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [180, 360, 565] },
  { level: 54, name: '深谋远虑', rows: 8, cols: 8, timeLimit: 90,  imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [210, 425, 665] },
  { level: 55, name: '料事如神', rows: 8, cols: 8, timeLimit: 85,  imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [215, 435, 680] },
  { level: 56, name: '神机妙算', rows: 8, cols: 10, timeLimit: 150, imageCount: 11, hintCount: 1,  shuffleCount: 1,  starScores: [220, 445, 695] },
  { level: 57, name: '未卜先知', rows: 8, cols: 10, timeLimit: 140, imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [225, 455, 715] },
  { level: 58, name: '洞察秋毫', rows: 8, cols: 10, timeLimit: 130, imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [230, 465, 730] },
  { level: 59, name: '明察暗访', rows: 8, cols: 10, timeLimit: 120, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [235, 475, 745] },
  { level: 60, name: '大师境界', rows: 8, cols: 10, timeLimit: 110, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [240, 485, 760] },

  // ============ 第61-70关：宗师境界 ============
  { level: 61, name: '宗师入门', rows: 8, cols: 8, timeLimit: 70,  imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [230, 465, 725] },
  { level: 62, name: '独步天下', rows: 8, cols: 8, timeLimit: 65,  imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [235, 475, 740] },
  { level: 63, name: '举世无敌', rows: 8, cols: 10, timeLimit: 110, imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [240, 485, 760] },
  { level: 64, name: '超群绝伦', rows: 8, cols: 10, timeLimit: 105, imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [245, 495, 775] },
  { level: 65, name: '出神入化', rows: 8, cols: 10, timeLimit: 100, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [250, 505, 790] },
  { level: 66, name: '鬼斧神工', rows: 8, cols: 10, timeLimit: 95,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [255, 515, 805] },
  { level: 67, name: '巧夺天工', rows: 8, cols: 10, timeLimit: 90,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [260, 525, 820] },
  { level: 68, name: '炉火纯青', rows: 8, cols: 10, timeLimit: 85,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [265, 535, 840] },
  { level: 69, name: '返璞归真', rows: 8, cols: 10, timeLimit: 80,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [270, 545, 855] },
  { level: 70, name: '宗师圆满', rows: 8, cols: 10, timeLimit: 75,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [275, 555, 870] },

  // ============ 第71-80关：传说之路 ============
  { level: 71, name: '传说开启', rows: 8, cols: 8, timeLimit: 60,  imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [240, 485, 760] },
  { level: 72, name: '传世之作', rows: 8, cols: 10, timeLimit: 80,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [265, 535, 840] },
  { level: 73, name: '千古流芳', rows: 8, cols: 10, timeLimit: 75,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [270, 545, 855] },
  { level: 74, name: '万古长青', rows: 10, cols: 10, timeLimit: 150, imageCount: 11, hintCount: 1,  shuffleCount: 0,  starScores: [300, 600, 940] },
  { level: 75, name: '永垂不朽', rows: 10, cols: 10, timeLimit: 140, imageCount: 11, hintCount: 0,  shuffleCount: 1,  starScores: [305, 615, 960] },
  { level: 76, name: '名垂青史', rows: 10, cols: 10, timeLimit: 130, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [310, 625, 980] },
  { level: 77, name: '彪炳千秋', rows: 10, cols: 10, timeLimit: 125, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [315, 635, 995] },
  { level: 78, name: '功盖千秋', rows: 10, cols: 10, timeLimit: 120, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [320, 645, 1010] },
  { level: 79, name: '威震天下', rows: 10, cols: 10, timeLimit: 115, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [325, 655, 1025] },
  { level: 80, name: '传说落幕', rows: 10, cols: 10, timeLimit: 110, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [330, 665, 1040] },

  // ============ 第81-90关：神话挑战 ============
  { level: 81, name: '神话序章', rows: 8, cols: 10, timeLimit: 65,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [280, 565, 885] },
  { level: 82, name: '天命所归', rows: 10, cols: 10, timeLimit: 110, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [330, 665, 1040] },
  { level: 83, name: '受命于天', rows: 10, cols: 10, timeLimit: 105, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [335, 675, 1055] },
  { level: 84, name: '真命天子', rows: 10, cols: 10, timeLimit: 100, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [340, 685, 1070] },
  { level: 85, name: '九五至尊', rows: 10, cols: 10, timeLimit: 95,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [345, 695, 1090] },
  { level: 86, name: '君临天下', rows: 10, cols: 10, timeLimit: 90,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [350, 705, 1105] },
  { level: 87, name: '唯我独尊', rows: 10, cols: 10, timeLimit: 85,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [355, 715, 1120] },
  { level: 88, name: '万寿无疆', rows: 10, cols: 10, timeLimit: 80,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [360, 725, 1135] },
  { level: 89, name: '天下太平', rows: 10, cols: 10, timeLimit: 75,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [365, 735, 1150] },
  { level: 90, name: '神话终章', rows: 10, cols: 10, timeLimit: 70,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [370, 745, 1165] },

  // ============ 第91-100关：登峰造极（地狱难度） ============
  { level: 91, name: '地狱之门', rows: 10, cols: 10, timeLimit: 65,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [375, 755, 1180] },
  { level: 92, name: '修罗战场', rows: 10, cols: 10, timeLimit: 60,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [380, 765, 1195] },
  { level: 93, name: '阿修罗道', rows: 10, cols: 12, timeLimit: 120, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [390, 785, 1230] },
  { level: 94, name: '无间炼狱', rows: 10, cols: 12, timeLimit: 110, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [395, 795, 1250] },
  { level: 95, name: '九死一生', rows: 10, cols: 12, timeLimit: 100, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [400, 805, 1265] },
  { level: 96, name: '万劫不复', rows: 10, cols: 12, timeLimit: 95,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [405, 815, 1280] },
  { level: 97, name: '浴火重生', rows: 10, cols: 12, timeLimit: 90,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [410, 825, 1295] },
  { level: 98, name: '涅槃重生', rows: 10, cols: 12, timeLimit: 85,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [415, 835, 1310] },
  { level: 99, name: '太平盛世', rows: 10, cols: 12, timeLimit: 80,  imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [420, 845, 1325] },
  { level: 100, name: '千秋万代', rows: 10, cols: 12, timeLimit: 75, imageCount: 11, hintCount: 0,  shuffleCount: 0,  starScores: [430, 860, 1350] }
]

/**
 * 获取指定关卡配置
 */
function getLevelConfig(level) {
  return LEVELS.find(l => l.level === level) || null
}

/**
 * 获取所有关卡配置
 */
function getAllLevels() {
  return LEVELS
}

/**
 * 获取总关卡数
 */
function getTotalLevels() {
  return LEVELS.length
}

/**
 * 获取最大关卡编号
 */
function getMaxLevel() {
  return LEVELS.length > 0 ? LEVELS[LEVELS.length - 1].level : 0
}

/**
 * 根据分数计算星级（0-3星）
 */
function calculateStars(level, score) {
  const config = getLevelConfig(level)
  if (!config) return 0
  const [one, two, three] = config.starScores
  if (score >= three) return 3
  if (score >= two) return 2
  if (score >= one) return 1
  return 0
}

/**
 * 判断某关是否已解锁
 * 第1关默认解锁，后续关卡需前一关至少1星
 */
function isLevelUnlocked(level, progressData) {
  if (level === 1) return true
  const prevLevel = progressData[level - 1]
  return prevLevel && prevLevel.stars > 0
}
