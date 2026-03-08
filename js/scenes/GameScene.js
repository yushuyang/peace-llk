/**
 * 游戏场景 - 连连看游戏主逻辑
 */
const { LinkUpGame } = require('../LinkUpGame.js')
const { getAllCharacters } = require('../TaiPingCharacters.js')
const { getLevelConfig, calculateStars } = require('../LevelConfig.js')

const BASE_CELL_SIZE = 60
const CELL_MARGIN = 8

class GameScene {
  constructor(gm) {
    this.gm = gm
    this.reset()
  }

  reset() {
    this.level = 1
    this.config = null
    this.game = null
    this.board = null
    this.selected = null
    this.score = 0
    this.timeLeft = 0
    this.totalTime = 0
    this.paused = false
    this.isGameOver = false
    this.connecting = false
    this.timer = null
    this.cellSize = BASE_CELL_SIZE
    this.gridRows = 0
    this.gridCols = 0
    this.boardX = 0
    this.boardY = 0
    this.boardWidth = 0
    this.boardHeight = 0
    this.hintLeft = -1
    this.shuffleLeft = -1
    this.showCharacter = false
    this.characterId = 0

    // 按钮区域（render 时填充）
    this.hintBtn = null
    this.shuffleBtn = null
    this.pauseBtn = null
    this.backBtn = null
    this.closeModalBtn = null
    this.resumeBtn = null
  }

  enter(params) {
    this.reset()
    this.level = params.level || 1
    this.config = getLevelConfig(this.level)

    if (!this.config) {
      wx.showToast({ title: '关卡不存在', icon: 'error' })
      setTimeout(() => this.gm.switchScene('menu'), 1500)
      return
    }

    const cfg = this.config
    this.gridRows = cfg.rows
    this.gridCols = cfg.cols
    this.timeLeft = cfg.timeLimit
    this.totalTime = cfg.timeLimit
    this.hintLeft = cfg.hintCount
    this.shuffleLeft = cfg.shuffleCount

    // 计算格子尺寸（适配屏幕）
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight
    const headerH = 92
    const bottomMargin = 10
    const boardPadding = 8

    const maxBoardW = W - 20
    const maxBoardH = H - headerH - bottomMargin - boardPadding * 2

    const cellByW = Math.floor((maxBoardW - CELL_MARGIN) / cfg.cols - CELL_MARGIN)
    const cellByH = Math.floor((maxBoardH - CELL_MARGIN) / cfg.rows - CELL_MARGIN)
    this.cellSize = Math.min(BASE_CELL_SIZE, cellByW, cellByH)
    this.cellSize = Math.max(this.cellSize, 28)

    this.boardWidth = cfg.cols * (this.cellSize + CELL_MARGIN) + CELL_MARGIN
    this.boardHeight = cfg.rows * (this.cellSize + CELL_MARGIN) + CELL_MARGIN
    this.boardX = (W - this.boardWidth) / 2
    this.boardY = headerH + (maxBoardH - this.boardHeight) / 2 + boardPadding

    // 初始化游戏逻辑
    this.game = new LinkUpGame(cfg.rows, cfg.cols)
    const pairCount = cfg.pairCount || Math.floor(cfg.rows * cfg.cols / 2)
    this.game.initWithImages(pairCount, cfg.imageCount || 11)

    if (!this.game.hasValidPair()) {
      this.game.shuffle()
    }
    this.board = this.game.getBoard()

    // 加载图片后渲染
    this.gm.loadImages().then(() => {
      this.render()
      this.startTimer()
    })
  }

  leave() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.paused || this.isGameOver) return
      this.timeLeft--
      this.render()
      if (this.timeLeft <= 0) {
        this.endGame(false)
      }
    }, 1000)
  }

  // ========== 渲染 ==========
  render() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight
    this.gm.resetCtx(ctx)

    // 背景
    this.gm.drawGradientBg(ctx, W, H)

    // 顶部信息栏
    this.renderHeader()

    // 棋盘背景
    this.gm.fillRoundRect(ctx,
      this.boardX - 6, this.boardY - 6,
      this.boardWidth + 12, this.boardHeight + 12,
      12, 'rgba(255,255,255,0.12)')

    // 棋盘
    this.renderBoard()

    // 覆盖层
    if (this.showCharacter) {
      this.renderCharacterModal()
    }
    if (this.paused) {
      this.renderPauseOverlay()
    }
  }

  renderHeader() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth

    // 白色背景卡片
    this.gm.fillRoundRect(ctx, 8, 5, W - 16, 82, 14, 'rgba(255,255,255,0.95)')

    // 关卡名
    ctx.fillStyle = '#667eea'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`第${this.level}关 · ${this.config.name}`, W / 2, 20)

    // 得分和时间
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#333'
    ctx.fillText(`得分: ${this.score}`, 22, 42)

    ctx.textAlign = 'right'
    ctx.fillStyle = this.timeLeft <= 10 ? '#ff4444' : '#333'
    ctx.fillText(`时间: ${this.timeLeft}s`, W - 22, 42)

    // 按钮行
    const btnH = 26
    const btnGap = 7
    const btnY = 58
    const hintLabel = this.hintLeft === -1 ? '提示' : `提示(${this.hintLeft})`
    const shuffleLabel = this.shuffleLeft === -1 ? '重排' : `重排(${this.shuffleLeft})`
    const labels = [hintLabel, shuffleLabel, '暂停', '返回']
    const btnCount = labels.length
    const btnW = Math.floor((W - 36 - btnGap * (btnCount - 1)) / btnCount)
    const btnStartX = 18

    for (let i = 0; i < btnCount; i++) {
      const x = btnStartX + i * (btnW + btnGap)
      const bgColor = i === 3 ? '#f5576c' : '#667eea'
      const btn = this.gm.drawButton(ctx, x, btnY, btnW, btnH, labels[i], {
        bgColor, fontSize: 12, radius: 13
      })
      if (i === 0) this.hintBtn = btn
      else if (i === 1) this.shuffleBtn = btn
      else if (i === 2) this.pauseBtn = btn
      else if (i === 3) this.backBtn = btn
    }
  }

  renderBoard() {
    const ctx = this.gm.ctx
    if (!this.board) return

    const cs = this.cellSize

    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const cell = this.board[row][col]
        const x = this.boardX + col * (cs + CELL_MARGIN) + CELL_MARGIN
        const y = this.boardY + row * (cs + CELL_MARGIN) + CELL_MARGIN

        if (cell.value > 0) {
          const isSelected = this.selected &&
            this.selected.row === row && this.selected.col === col

          // 卡片背景
          this.gm.fillRoundRect(ctx, x, y, cs, cs, 6,
            isSelected ? '#FFD700' : '#FFFFFF')

          // 边框
          if (isSelected) {
            this.gm.strokeRoundRect(ctx, x, y, cs, cs, 6, '#FF6B6B', 3)
          } else {
            this.gm.strokeRoundRect(ctx, x, y, cs, cs, 6, '#E0E0E0', 1)
          }

          // 图片
          const img = this.gm.images[cell.value]
          if (img) {
            const pad = 4
            ctx.drawImage(img, x + pad, y + pad, cs - pad * 2, cs - pad * 2)
          } else {
            ctx.fillStyle = '#999'
            ctx.font = `${Math.max(12, Math.floor(cs * 0.26))}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(String(cell.value), x + cs / 2, y + cs / 2)
          }
        }
        // value === 0 的空格子不绘制，显示棋盘背景
      }
    }
  }

  drawPath(path) {
    if (!path || path.length < 2) return
    const ctx = this.gm.ctx
    const cs = this.cellSize

    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()

    path.forEach((point, i) => {
      const x = this.boardX + point.col * (cs + CELL_MARGIN) + CELL_MARGIN + cs / 2
      const y = this.boardY + point.row * (cs + CELL_MARGIN) + CELL_MARGIN + cs / 2
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.stroke()
  }

  renderCharacterModal() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight

    // 遮罩
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(0, 0, W, H)

    // 弹窗卡片
    const mw = 260
    const mh = 310
    const mx = (W - mw) / 2
    const my = (H - mh) / 2
    this.gm.fillRoundRect(ctx, mx, my, mw, mh, 16, '#fff')

    // 角色图片
    const img = this.gm.images[this.characterId]
    if (img) {
      const imgSize = 100
      ctx.drawImage(img, mx + (mw - imgSize) / 2, my + 20, imgSize, imgSize)
    }

    // 角色信息
    const chars = getAllCharacters()
    const char = chars.find(c => c.id === this.characterId)
    if (char) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.fillStyle = '#333'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText(char.name, mx + mw / 2, my + 140)

      ctx.fillStyle = '#666'
      ctx.font = '14px sans-serif'
      ctx.fillText(`演员: ${char.actor}`, mx + mw / 2, my + 168)

      ctx.fillStyle = '#DC143C'
      ctx.font = '13px sans-serif'
      ctx.fillText(char.title || '', mx + mw / 2, my + 193)

      ctx.fillStyle = '#888'
      ctx.font = '12px sans-serif'
      ctx.fillText(char.desc || '', mx + mw / 2, my + 218)
    }

    // 关闭按钮
    this.closeModalBtn = this.gm.drawButton(ctx,
      mx + (mw - 110) / 2, my + mh - 55, 110, 36, '关闭', {
        gradient: ['#667eea', '#764ba2'], fontSize: 15
      })
  }

  renderPauseOverlay() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight

    ctx.fillStyle = 'rgba(0,0,0,0.8)'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 30px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('游戏暂停', W / 2, H / 2 - 40)

    this.resumeBtn = this.gm.drawButton(ctx,
      (W - 160) / 2, H / 2 + 10, 160, 44, '继续游戏', {
        gradient: ['#667eea', '#764ba2'], fontSize: 18
      })
  }

  // ========== 触摸事件 ==========
  onTouchStart(x, y) {}

  onTouchEnd(x, y) {
    if (this.isGameOver) return

    // 覆盖层优先处理
    if (this.showCharacter) {
      if (this.gm.hitTest(x, y, this.closeModalBtn)) {
        this.showCharacter = false
        this.render()
      }
      return
    }

    if (this.paused) {
      if (this.gm.hitTest(x, y, this.resumeBtn)) {
        this.paused = false
        this.render()
      }
      return
    }

    // 暂停和返回按钮始终可用
    if (this.gm.hitTest(x, y, this.pauseBtn)) {
      this.paused = true
      this.render()
      return
    }
    if (this.gm.hitTest(x, y, this.backBtn)) {
      this.gm.switchScene('menu')
      return
    }

    // 连接动画中不响应其他操作
    if (this.connecting) return

    // 提示和重排按钮
    if (this.gm.hitTest(x, y, this.hintBtn)) {
      this.showHint()
      return
    }
    if (this.gm.hitTest(x, y, this.shuffleBtn)) {
      this.shuffleBoard()
      return
    }

    // 棋盘点击
    const localX = x - this.boardX
    const localY = y - this.boardY
    if (localX < 0 || localY < 0 || localX > this.boardWidth || localY > this.boardHeight) return

    const cs = this.cellSize
    const col = Math.floor((localX - CELL_MARGIN / 2) / (cs + CELL_MARGIN))
    const row = Math.floor((localY - CELL_MARGIN / 2) / (cs + CELL_MARGIN))

    this.handleCellClick(row, col)
  }

  onTouchMove(x, y) {}

  // ========== 游戏逻辑 ==========
  handleCellClick(row, col) {
    if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) return
    if (!this.board || !this.board[row] || !this.board[row][col]) return

    const cell = this.board[row][col]
    if (cell.value === 0) return

    // 首次选择
    if (!this.selected) {
      this.selected = { row, col }
      this.render()
      return
    }

    const { row: r1, col: c1 } = this.selected

    // 点击同一个 → 显示角色详情
    if (r1 === row && c1 === col) {
      this.characterId = cell.value
      this.showCharacter = true
      this.selected = null
      this.render()
      return
    }

    // 尝试连接
    const path = this.game.findPath(r1, c1, row, col)

    if (path) {
      this.connecting = true
      this.render()
      this.drawPath(path)

      setTimeout(() => {
        this.game.removePair(r1, c1, row, col)
        this.board = this.game.getBoard()
        this.score += 10 + Math.floor(this.timeLeft / 10)
        this.selected = null
        this.connecting = false
        this.render()

        if (this.game.getRemainingPairs() === 0) {
          this.endGame(true)
        } else if (!this.game.hasValidPair()) {
          this.game.shuffle()
          this.board = this.game.getBoard()
          this.render()
          wx.showToast({ title: '已自动重排', icon: 'none', duration: 1000 })
        }
      }, 300)
    } else {
      // 切换选中
      this.selected = { row, col }
      this.render()
    }
  }

  showHint() {
    if (this.hintLeft === 0) {
      wx.showToast({ title: '提示次数已用完', icon: 'none' })
      return
    }

    const hint = this.game.getHint()
    if (hint) {
      if (this.hintLeft > 0) this.hintLeft--

      this.selected = { row: hint.row1, col: hint.col1 }
      this.render()

      setTimeout(() => {
        this.selected = null
        this.render()
      }, 1000)
    }
  }

  shuffleBoard() {
    if (this.shuffleLeft === 0) {
      wx.showToast({ title: '重排次数已用完', icon: 'none' })
      return
    }

    if (this.shuffleLeft > 0) this.shuffleLeft--

    this.game.shuffle()
    this.board = this.game.getBoard()
    this.selected = null
    this.render()
  }

  endGame(won) {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.isGameOver = true

    const usedTime = this.totalTime - this.timeLeft
    let stars = 0
    let isNewRecord = false

    if (won) {
      // 在保存前检测是否新纪录
      const progress = this.gm.getLevelProgress()
      const prevBest = progress[this.level] ? progress[this.level].bestScore : 0
      isNewRecord = this.score > prevBest

      stars = calculateStars(this.level, this.score)
      if (stars < 1) stars = 1

      this.gm.saveLevelResult(this.level, stars, this.score, usedTime)

      const bestScore = wx.getStorageSync('bestScore') || 0
      if (this.score > bestScore) {
        wx.setStorageSync('bestScore', this.score)
      }
    }

    setTimeout(() => {
      this.gm.switchScene('result', {
        won, score: this.score, level: this.level,
        stars, usedTime, isNewRecord
      })
    }, 500)
  }
}
module.exports = { GameScene }
