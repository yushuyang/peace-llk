// pages/play/play.js
import { LinkUpGame } from '../../js/LinkUpGame.js'
import { getAllCharacters } from '../../js/TaiPingCharacters.js'
import { getLevelConfig, calculateStars } from '../../js/LevelConfig.js'

const BASE_CELL_SIZE = 60
const CELL_MARGIN = 8

Page({
  data: {
    level: 1,
    levelName: '',
    score: 0,
    timeLeft: 60,
    totalTime: 60,
    gridRows: 4,
    gridCols: 4,
    selectedRow: -1,
    selectedCol: -1,
    connecting: false,
    gameOver: false,
    paused: false,
    pauseText: '暂停',
    hintLeft: -1,
    shuffleLeft: -1,
    showHintCount: false,
    showShuffleCount: false,
    showCharacterModal: false,
    selectedCharacterImage: '',
    selectedCharacterName: '',
    selectedCharacterActor: '',
    selectedCharacterDesc: '',
    canvasWidth: 300,
    canvasHeight: 300,
    canvasStyleWidth: 300,
    canvasStyleHeight: 300
  },

  game: null,
  timer: null,
  canvas: null,
  ctx: null,
  loadedImages: {},
  _board: null,
  _selected: null,
  _canvasRect: null,
  _levelConfig: null,
  _cellSize: BASE_CELL_SIZE,

  onLoad(options) {
    const level = parseInt(options.level) || 1
    const config = getLevelConfig(level)

    if (!config) {
      wx.showToast({ title: '关卡不存在', icon: 'error' })
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }

    this._levelConfig = config
    const rows = config.rows
    const cols = config.cols
    const time = config.timeLimit

    // 根据棋盘大小动态调整格子尺寸，确保大棋盘适配屏幕
    const sysInfo = wx.getSystemInfoSync()
    const maxWidth = sysInfo.windowWidth - 40
    const maxHeight = sysInfo.windowHeight - 260  // 预留顶部信息栏和底部按钮
    const cellByWidth = Math.floor((maxWidth - CELL_MARGIN) / cols - CELL_MARGIN)
    const cellByHeight = Math.floor((maxHeight - CELL_MARGIN) / rows - CELL_MARGIN)
    const cellSize = Math.min(BASE_CELL_SIZE, cellByWidth, cellByHeight)
    this._cellSize = Math.max(cellSize, 28)  // 最小28px保证可点击

    const canvasWidth = cols * (this._cellSize + CELL_MARGIN) + CELL_MARGIN
    const canvasHeight = rows * (this._cellSize + CELL_MARGIN) + CELL_MARGIN
    const scale = maxWidth / canvasWidth
    const finalScale = scale < 1 ? scale : 1

    this.setData({
      level: level,
      levelName: config.name,
      gridRows: rows,
      gridCols: cols,
      timeLeft: time,
      totalTime: time,
      hintLeft: config.hintCount,
      shuffleLeft: config.shuffleCount,
      showHintCount: config.hintCount !== -1,
      showShuffleCount: config.shuffleCount !== -1,
      canvasWidth,
      canvasHeight,
      canvasStyleWidth: Math.floor(canvasWidth * finalScale),
      canvasStyleHeight: Math.floor(canvasHeight * finalScale),
      scale: finalScale
    })

    this.initGame(rows, cols, config.imageCount)
  },

  onReady() {
    this.initCanvas()
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  initCanvas() {
    const query = wx.createSelectorQuery()
    query.select('#gameCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) {
        console.error('Canvas not found')
        return
      }
      
      this.canvas = res[0].node
      this.ctx = this.canvas.getContext('2d')
      
      this.canvas.width = this.data.canvasWidth
      this.canvas.height = this.data.canvasHeight
      
      // 缓存 canvas 位置，用于点击坐标计算
      this._cacheCanvasRect()
      
      this.loadImages().then(() => {
        this.drawBoard()
      })
    })
  },

  loadImages() {
    return new Promise((resolve) => {
      const characters = getAllCharacters()
      let loadedCount = 0
      const total = characters.length
      
      if (total === 0) {
        resolve()
        return
      }
      
      characters.forEach(char => {
        const imgPath = `/images/char${String(char.id).padStart(2, '0')}.png`
        const img = this.canvas.createImage()
        
        img.onload = () => {
          this.loadedImages[char.id] = img
          loadedCount++
          if (loadedCount >= total) {
            resolve()
          }
        }
        
        img.onerror = () => {
          console.error('Failed to load image:', imgPath)
          loadedCount++
          if (loadedCount >= total) {
            resolve()
          }
        }
        
        img.src = imgPath
      })
    })
  },

  initGame(rows, cols, imageCount) {
    this.game = new LinkUpGame(rows, cols)
    const config = this._levelConfig
    const pairCount = (config && config.pairCount) ? config.pairCount : Math.floor(rows * cols / 2)
    this.game.initWithImages(pairCount, imageCount || 11)
    
    // 确保初始棋盘有可消除的配对
    if (!this.game.hasValidPair()) {
      this.game.shuffle()
    }
    
    this._board = this.game.getBoard()
    this.startTimer()
  },

  startTimer() {
    this.timer = setInterval(() => {
      if (this.data.paused || this.data.gameOver) return
      
      const newTime = this.data.timeLeft - 1
      this.setData({ timeLeft: newTime })
      
      if (newTime <= 0) {
        this.gameOver(false)
      }
    }, 1000)
  },

  // 缓存 canvas 元素位置
  _cacheCanvasRect() {
    wx.createSelectorQuery().select('#gameCanvas').boundingClientRect().exec((res) => {
      if (res && res[0]) {
        this._canvasRect = res[0]
      }
    })
  },

  onCanvasTap(e) {
    if (this.data.gameOver || this.data.paused || this.data.connecting) return
    if (!this.canvas) return
    
    // 兼容获取点击坐标（页面坐标系）
    // tap 事件的 e.detail.x/y 始终可用且为页面坐标
    const touch = e.changedTouches && e.changedTouches[0]
    let tapX, tapY
    
    if (e.detail && typeof e.detail.x === 'number') {
      tapX = e.detail.x
      tapY = e.detail.y
    } else if (touch) {
      tapX = touch.clientX !== undefined ? touch.clientX : touch.pageX
      tapY = touch.clientY !== undefined ? touch.clientY : touch.pageY
    }
    
    if (tapX === undefined || tapY === undefined || isNaN(tapX) || isNaN(tapY)) return
    
    const processClick = (rect) => {
      if (!rect || !rect.width || !rect.height) return
      
      const offsetX = tapX - rect.left
      const offsetY = tapY - rect.top
      
      if (offsetX < 0 || offsetY < 0 || offsetX > rect.width || offsetY > rect.height) return
      
      const scaleX = this.data.canvasWidth / rect.width
      const scaleY = this.data.canvasHeight / rect.height
      
      const x = offsetX * scaleX
      const y = offsetY * scaleY
      
      const cs = this._cellSize
      const col = Math.floor((x - CELL_MARGIN / 2) / (cs + CELL_MARGIN))
      const row = Math.floor((y - CELL_MARGIN / 2) / (cs + CELL_MARGIN))
      
      this.handleCellClick(row, col)
    }
    
    // 优先用缓存的 rect（同步、无延迟），否则实时查询
    if (this._canvasRect) {
      processClick(this._canvasRect)
    } else {
      wx.createSelectorQuery().select('#gameCanvas').boundingClientRect().exec((res) => {
        if (res && res[0]) {
          this._canvasRect = res[0]
          processClick(res[0])
        }
      })
    }
  },

  handleCellClick(row, col) {
    if (row < 0 || row >= this.data.gridRows || col < 0 || col >= this.data.gridCols) return
    
    const board = this._board
    if (!board || !board[row] || !board[row][col]) return
    
    const cell = board[row][col]
    if (cell.value === 0) return
    
    if (!this._selected) {
      this._selected = { row, col }
      this.setData({ selectedRow: row, selectedCol: col })
      this.drawBoard()
      return
    }
    
    const { row: r1, col: c1 } = this._selected
    
    if (r1 === row && c1 === col) {
      this.showCharacterDetail(cell.value)
      this._selected = null
      this.setData({ selectedRow: -1, selectedCol: -1 })
      this.drawBoard()
      return
    }
    
    const path = this.game.findPath(r1, c1, row, col)
    
    if (path) {
      this.setData({ connecting: true })
      this.drawPath(path)
      
      setTimeout(() => {
        this.game.removePair(r1, c1, row, col)
        this._board = this.game.getBoard()
        const newScore = this.data.score + 10 + Math.floor(this.data.timeLeft / 10)
        
        this.setData({
          selectedRow: -1,
          selectedCol: -1,
          score: newScore,
          connecting: false
        })
        this._selected = null
        
        this.drawBoard()
        
        if (this.game.getRemainingPairs() === 0) {
          this.gameOver(true)
        } else if (!this.game.hasValidPair()) {
          // 无可消除配对时自动洗牌
          this.game.shuffle()
          this._board = this.game.getBoard()
          this.drawBoard()
          wx.showToast({ title: '已自动重排', icon: 'none', duration: 1000 })
        }
      }, 300)
    } else {
      this._selected = { row, col }
      this.setData({ selectedRow: row, selectedCol: col })
      this.drawBoard()
    }
  },

  drawBoard() {
    if (!this.ctx || !this.canvas) return
    
    const ctx = this.ctx
    
    // 清空画布
    ctx.fillStyle = '#FFF5F5'
    ctx.fillRect(0, 0, this.data.canvasWidth, this.data.canvasHeight)
    
    const board = this._board
    if (!board) return
    
    for (let row = 0; row < this.data.gridRows; row++) {
      for (let col = 0; col < this.data.gridCols; col++) {
        const cell = board[row][col]
        const cs = this._cellSize
        const x = col * (cs + CELL_MARGIN) + CELL_MARGIN
        const y = row * (cs + CELL_MARGIN) + CELL_MARGIN
        
        if (cell.value > 0) {
          const isSelected = this._selected &&
            this._selected.row === row &&
            this._selected.col === col
          
          // 绘制背景
          ctx.fillStyle = isSelected ? '#FFD700' : '#FFFFFF'
          ctx.fillRect(x, y, cs, cs)
          
          // 绘制选中边框
          if (isSelected) {
            ctx.strokeStyle = '#FF6B6B'
            ctx.lineWidth = 4
            ctx.strokeRect(x, y, cs, cs)
          } else {
            ctx.strokeStyle = '#E0E0E0'
            ctx.lineWidth = 1
            ctx.strokeRect(x, y, cs, cs)
          }
          
          // 绘制图片
          const img = this.loadedImages[cell.value]
          if (img) {
            const padding = 4
            ctx.drawImage(img, x + padding, y + padding, cs - padding * 2, cs - padding * 2)
          } else {
            // 图片未加载时显示数字
            ctx.fillStyle = '#999'
            ctx.font = `${Math.max(12, Math.floor(cs * 0.26))}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(cell.value.toString(), x + cs / 2, y + cs / 2)
          }
        } else {
          // 已消除的格子
          ctx.fillStyle = '#E8E8E8'
          ctx.fillRect(x, y, cs, cs)
        }
      }
    }
  },

  drawPath(path) {
    if (!this.ctx || !path || path.length < 2) return
    
    const ctx = this.ctx
    
    ctx.strokeStyle = '#FF6B6B'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    path.forEach((point, index) => {
      const cs = this._cellSize
      const x = point.col * (cs + CELL_MARGIN) + CELL_MARGIN + cs / 2
      const y = point.row * (cs + CELL_MARGIN) + CELL_MARGIN + cs / 2
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
  },

  showHint() {
    if (this.data.gameOver || this.data.paused) return
    
    if (this.data.showHintCount && this.data.hintLeft === 0) {
      wx.showToast({ title: '提示次数已用完', icon: 'none' })
      return
    }
    
    const hint = this.game.getHint()
    if (hint) {
      if (this.data.showHintCount) {
        this.setData({ hintLeft: this.data.hintLeft - 1 })
      }
      
      this._selected = { row: hint.row1, col: hint.col1 }
      this.setData({ selectedRow: hint.row1, selectedCol: hint.col1 })
      this.drawBoard()
      
      setTimeout(() => {
        this._selected = null
        this.setData({ selectedRow: -1, selectedCol: -1 })
        this.drawBoard()
      }, 1000)
    }
  },

  shuffleBoard() {
    if (this.data.gameOver || this.data.paused) return
    
    if (this.data.showShuffleCount && this.data.shuffleLeft === 0) {
      wx.showToast({ title: '重排次数已用完', icon: 'none' })
      return
    }
    
    if (this.data.showShuffleCount) {
      this.setData({ shuffleLeft: this.data.shuffleLeft - 1 })
    }
    
    this.game.shuffle()
    this._board = this.game.getBoard()
    this._selected = null
    this.setData({ selectedRow: -1, selectedCol: -1 })
    this.drawBoard()
  },

  togglePause() {
    const paused = !this.data.paused
    this.setData({
      paused: paused,
      pauseText: paused ? '继续' : '暂停'
    })
  },

  gameOver(won) {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    this.setData({ gameOver: true })
    
    const usedTime = this.data.totalTime - this.data.timeLeft
    const level = this.data.level
    let stars = 0

    if (won) {
      stars = calculateStars(level, this.data.score)
      if (stars < 1) stars = 1  // 通关至少1星

      const app = getApp()
      app.saveLevelResult(level, stars, this.data.score, usedTime)

      // 兼容旧全局最高分
      const bestScore = wx.getStorageSync('bestScore') || 0
      if (this.data.score > bestScore) {
        wx.setStorageSync('bestScore', this.data.score)
      }
    }
    
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/result/result?won=${won}&score=${this.data.score}&level=${level}&stars=${stars}&usedTime=${usedTime}`
      })
    }, 500)
  },

  showCharacterDetail(value) {
    const characters = getAllCharacters()
    const character = characters.find(c => c.id === value)
    if (character) {
      this.setData({
        selectedCharacterImage: character.image || '',
        selectedCharacterName: character.name || '',
        selectedCharacterActor: character.actor || '',
        selectedCharacterDesc: character.description || '',
        showCharacterModal: true
      })
    }
  },

  closeCharacterModal() {
    this.setData({
      showCharacterModal: false,
      selectedCharacterImage: '',
      selectedCharacterName: '',
      selectedCharacterActor: '',
      selectedCharacterDesc: ''
    })
  },

  backToHome() {
    wx.navigateBack()
  }
})