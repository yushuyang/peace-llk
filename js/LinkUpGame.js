/**
 * 连连看游戏核心逻辑
 * 支持规则：直线、1个拐角、2个拐角（可经过边界外）
 */
class LinkUpGame {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    this.board = []
    this.totalPairs = 0
  }
  
  init() {
    const totalCells = this.rows * this.cols
    this.totalPairs = Math.floor(totalCells / 2)
    this.initWithPairs(this.totalPairs)
  }
  
  /**
   * 使用指定数量的图片初始化
   * 当配对数超过可用图片数时，循环复用图片以铺满整个棋盘
   * @param {number} pairCount - 配对数量
   * @param {number} maxImageCount - 可用图片数量
   */
  initWithImages(pairCount, maxImageCount) {
    this.totalPairs = pairCount
    const totalCells = this.rows * this.cols
    const cardCount = pairCount * 2
    const cards = []
    
    // 循环分配图片ID，确保每种图片都成对出现
    for (let i = 0; i < pairCount; i++) {
      const imageId = (i % maxImageCount) + 1
      cards.push(imageId, imageId)
    }
    
    // 打乱顺序
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]
    }
    
    // 先初始化整个棋盘为空
    this.board = []
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = []
      for (let col = 0; col < this.cols; col++) {
        this.board[row][col] = { value: 0, row, col }
      }
    }
    
    if (cardCount >= totalCells) {
      // 满铺模式：卡牌填满所有格子
      let cardIndex = 0
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          this.board[row][col].value = cards[cardIndex]
          cardIndex++
        }
      }
    } else {
      // 稀疏模式：随机选择位置放置卡牌，其余留空
      const allPositions = []
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          allPositions.push({ row, col })
        }
      }
      // 打乱位置
      for (let i = allPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]]
      }
      // 取前 cardCount 个位置放卡牌
      for (let i = 0; i < cardCount; i++) {
        const pos = allPositions[i]
        this.board[pos.row][pos.col].value = cards[i]
      }
    }
  }
  
  initWithPairs(pairCount) {
    const cards = []
    for (let i = 1; i <= pairCount; i++) { cards.push(i, i) }
    
    // 打乱顺序
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]
    }
    
    // 填充游戏板
    this.board = []
    let cardIndex = 0
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = []
      for (let col = 0; col < this.cols; col++) {
        if (cardIndex < cards.length) {
          this.board[row][col] = { value: cards[cardIndex], row, col }
          cardIndex++
        } else {
          this.board[row][col] = { value: 0, row, col }
        }
      }
    }
  }
  
  getBoard() { return this.board }
  
  getCell(row, col) {
    // 支持虚拟边界（-1 和 rows/cols）
    if (row === -1 || row === this.rows || col === -1 || col === this.cols) {
      return { value: 0, row, col, isVirtual: true }
    }
    if (row < -1 || row > this.rows || col < -1 || col > this.cols) {
      return { value: -1 } // 越界
    }
    return this.board[row]?.[col] || { value: 0 }
  }
  
  getRemainingPairs() {
    let count = 0
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col].value > 0) count++
      }
    }
    return count / 2
  }
  
  removePair(row1, col1, row2, col2) {
    this.board[row1][col1].value = 0
    this.board[row2][col2].value = 0
  }
  
  /**
   * 判断某个位置是否被阻挡（有牌且不是虚拟边界）
   */
  isCellBlocked(row, col) {
    const cell = this.getCell(row, col)
    return cell.value !== 0 && !cell.isVirtual
  }

  /**
   * 查找连接路径（严格连连看规则）
   * 规则：两张相同的牌，用不超过2个拐角的折线连接，折线不经过其他牌，即可消除
   * 折线只能水平或垂直，可经过棋盘边界外的虚拟空间
   * 返回路径点数组或null
   */
  findPath(row1, col1, row2, col2) {
    const cell1 = this.getCell(row1, col1)
    const cell2 = this.getCell(row2, col2)
    
    if (cell1.value === 0 || cell2.value === 0) return null
    if (cell1.value !== cell2.value) return null
    if (row1 === row2 && col1 === col2) return null
    
    // 1. 直线连接（0个拐角）
    if (this.canConnectDirectly(row1, col1, row2, col2)) {
      return [{ row: row1, col: col1 }, { row: row2, col: col2 }]
    }
    
    // 2. 一个拐角（L形，2条线段）
    const oneCornerPath = this.findOneCornerPath(row1, col1, row2, col2)
    if (oneCornerPath) return oneCornerPath
    
    // 3. 两个拐角（U形/Z形，3条线段）
    const twoCornerPath = this.findTwoCornerPath(row1, col1, row2, col2)
    if (twoCornerPath) return twoCornerPath
    
    return null
  }
  
  /**
   * 检查两点之间是否可以直线连接
   * 两点必须在同一行或同一列，且中间所有格子为空
   */
  canConnectDirectly(row1, col1, row2, col2) {
    if (row1 === row2) {
      const minCol = Math.min(col1, col2)
      const maxCol = Math.max(col1, col2)
      for (let c = minCol + 1; c < maxCol; c++) {
        if (this.isCellBlocked(row1, c)) return false
      }
      return true
    }
    
    if (col1 === col2) {
      const minRow = Math.min(row1, row2)
      const maxRow = Math.max(row1, row2)
      for (let r = minRow + 1; r < maxRow; r++) {
        if (this.isCellBlocked(r, col1)) return false
      }
      return true
    }
    
    return false
  }
  
  /**
   * 查找一个拐角的L形路径
   * 两个候选拐角点：(row1, col2) 和 (row2, col1)
   * 拐角点必须为空，且两段路径都畅通
   */
  findOneCornerPath(row1, col1, row2, col2) {
    // 同行或同列不存在L形拐角
    if (row1 === row2 || col1 === col2) return null
    
    // 拐角点1: (row1, col2)
    if (!this.isCellBlocked(row1, col2) &&
        this.canConnectDirectly(row1, col1, row1, col2) &&
        this.canConnectDirectly(row1, col2, row2, col2)) {
      return [
        { row: row1, col: col1 },
        { row: row1, col: col2 },
        { row: row2, col: col2 }
      ]
    }
    
    // 拐角点2: (row2, col1)
    if (!this.isCellBlocked(row2, col1) &&
        this.canConnectDirectly(row1, col1, row2, col1) &&
        this.canConnectDirectly(row2, col1, row2, col2)) {
      return [
        { row: row1, col: col1 },
        { row: row2, col: col1 },
        { row: row2, col: col2 }
      ]
    }
    
    return null
  }
  
  /**
   * 查找两个拐角的U形/Z形路径
   *
   * 水平扫描：遍历每一行r（含边界外 -1 和 rows）
   *   路径：(r1,c1) → (r,c1) → (r,c2) → (r2,c2)
   *   拐角：(r,c1) 和 (r,c2)
   *
   * 垂直扫描：遍历每一列c（含边界外 -1 和 cols）
   *   路径：(r1,c1) → (r1,c) → (r2,c) → (r2,c2)
   *   拐角：(r1,c) 和 (r2,c)
   */
  findTwoCornerPath(row1, col1, row2, col2) {
    // 水平扫描：通过第 r 行中转
    for (let r = -1; r <= this.rows; r++) {
      // r 等于起点行或终点行时退化为 ≤1 个拐角，已在前面处理
      if (r === row1 || r === row2) continue
      
      // 两个拐角点 (r,col1) 和 (r,col2) 必须为空或虚拟
      if (this.isCellBlocked(r, col1)) continue
      if (this.isCellBlocked(r, col2)) continue
      
      // 三段路径必须全部畅通
      if (this.canConnectDirectly(row1, col1, r, col1) &&
          this.canConnectDirectly(r, col1, r, col2) &&
          this.canConnectDirectly(r, col2, row2, col2)) {
        return [
          { row: row1, col: col1 },
          { row: r, col: col1 },
          { row: r, col: col2 },
          { row: row2, col: col2 }
        ]
      }
    }
    
    // 垂直扫描：通过第 c 列中转
    for (let c = -1; c <= this.cols; c++) {
      if (c === col1 || c === col2) continue
      
      if (this.isCellBlocked(row1, c)) continue
      if (this.isCellBlocked(row2, c)) continue
      
      if (this.canConnectDirectly(row1, col1, row1, c) &&
          this.canConnectDirectly(row1, c, row2, c) &&
          this.canConnectDirectly(row2, c, row2, col2)) {
        return [
          { row: row1, col: col1 },
          { row: row1, col: c },
          { row: row2, col: c },
          { row: row2, col: col2 }
        ]
      }
    }
    
    return null
  }
  
  /**
   * 获取提示
   */
  getHint() {
    for (let row1 = 0; row1 < this.rows; row1++) {
      for (let col1 = 0; col1 < this.cols; col1++) {
        if (this.board[row1][col1].value === 0) continue
        
        for (let row2 = row1; row2 < this.rows; row2++) {
          const startCol = (row2 === row1) ? col1 + 1 : 0
          for (let col2 = startCol; col2 < this.cols; col2++) {
            if (this.board[row2][col2].value === 0) continue
            if (this.board[row1][col1].value !== this.board[row2][col2].value) continue
            
            if (this.findPath(row1, col1, row2, col2)) {
              return { row1, col1, row2, col2 }
            }
          }
        }
      }
    }
    return null
  }
  
  /**
   * 洗牌（确保洗牌后至少存在一对可消除的配对）
   */
  shuffle() {
    const positions = []
    const remainingCards = []
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col].value > 0) {
          positions.push({ row, col })
          remainingCards.push(this.board[row][col].value)
        }
      }
    }
    
    if (remainingCards.length === 0) return
    
    // 尝试洗牌，最多100次，确保存在可消除配对
    let attempts = 0
    do {
      // Fisher-Yates 洗牌
      for (let i = remainingCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingCards[i], remainingCards[j]] = [remainingCards[j], remainingCards[i]]
      }
      
      // 填入棋盘
      for (let k = 0; k < positions.length; k++) {
        const { row, col } = positions[k]
        this.board[row][col].value = remainingCards[k]
      }
      
      attempts++
    } while (!this.hasValidPair() && attempts < 100)
  }
  
  /**
   * 检查是否还有可连接的牌对（用于判断是否需要重排）
   */
  hasValidPair() {
    return this.getHint() !== null
  }
}