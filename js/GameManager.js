/**
 * 游戏管理器 - 场景管理、存储、图片加载、绘图工具
 */
const { MenuScene } = require('./scenes/MenuScene.js')
const { GameScene } = require('./scenes/GameScene.js')
const { ResultScene } = require('./scenes/ResultScene.js')
const { getAllCharacters } = require('./TaiPingCharacters.js')

class GameManager {
  constructor(canvas, ctx, screenWidth, screenHeight) {
    this.canvas = canvas
    this.ctx = ctx
    this.screenWidth = screenWidth
    this.screenHeight = screenHeight
    this.currentScene = null
    this.images = {}
    this.imagesLoaded = false

    this.scenes = {
      menu: new MenuScene(this),
      game: new GameScene(this),
      result: new ResultScene(this)
    }

    this.initStorage()
  }

  // ========== 存储 ==========
  initStorage() {
    if (!wx.getStorageSync('levelProgress')) {
      wx.setStorageSync('levelProgress', {})
    }
    if (!wx.getStorageSync('bestScore')) {
      wx.setStorageSync('bestScore', 0)
    }
  }

  getLevelProgress() {
    return wx.getStorageSync('levelProgress') || {}
  }

  saveLevelResult(level, stars, score, time) {
    const progress = this.getLevelProgress()
    const prev = progress[level] || { stars: 0, bestScore: 0, bestTime: 0 }
    progress[level] = {
      stars: Math.max(prev.stars, stars),
      bestScore: Math.max(prev.bestScore, score),
      bestTime: prev.bestTime > 0 ? Math.min(prev.bestTime, time) : time
    }
    wx.setStorageSync('levelProgress', progress)
  }

  // ========== 图片加载 ==========
  loadImages() {
    if (this.imagesLoaded) return Promise.resolve()

    return new Promise((resolve) => {
      const characters = getAllCharacters()
      let count = 0
      const total = characters.length

      if (total === 0) { this.imagesLoaded = true; resolve(); return }

      characters.forEach(char => {
        const img = wx.createImage()
        img.onload = () => {
          this.images[char.id] = img
          count++
          if (count >= total) { this.imagesLoaded = true; resolve() }
        }
        img.onerror = () => {
          console.error('Failed to load:', char.id)
          count++
          if (count >= total) { this.imagesLoaded = true; resolve() }
        }
        img.src = `images/char${String(char.id).padStart(2, '0')}.png`
      })
    })
  }

  // ========== 场景管理 ==========
  start() {
    this.switchScene('menu')
  }

  switchScene(name, params) {
    if (this.currentScene && this.currentScene.leave) {
      this.currentScene.leave()
    }
    this.currentScene = this.scenes[name]
    if (this.currentScene && this.currentScene.enter) {
      this.currentScene.enter(params || {})
    }
  }

  // ========== 事件分发 ==========
  onTouchStart(x, y) {
    if (this.currentScene && this.currentScene.onTouchStart) {
      this.currentScene.onTouchStart(x, y)
    }
  }
  onTouchEnd(x, y) {
    if (this.currentScene && this.currentScene.onTouchEnd) {
      this.currentScene.onTouchEnd(x, y)
    }
  }
  onTouchMove(x, y) {
    if (this.currentScene && this.currentScene.onTouchMove) {
      this.currentScene.onTouchMove(x, y)
    }
  }

  // ========== 绘图工具 ==========
  drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }

  fillRoundRect(ctx, x, y, w, h, r, color) {
    ctx.fillStyle = color
    this.drawRoundRect(ctx, x, y, w, h, r)
    ctx.fill()
  }

  strokeRoundRect(ctx, x, y, w, h, r, color, lineWidth) {
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth || 1
    this.drawRoundRect(ctx, x, y, w, h, r)
    ctx.stroke()
  }

  drawGradientBg(ctx, w, h) {
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)
  }

  drawButton(ctx, x, y, w, h, text, options) {
    const opt = options || {}
    const radius = opt.radius || Math.floor(h / 2)
    const fontSize = opt.fontSize || 14
    const bgColor = opt.bgColor || '#667eea'
    const textColor = opt.textColor || '#fff'
    const gradient = opt.gradient

    if (gradient) {
      const grad = ctx.createLinearGradient(x, y, x + w, y)
      grad.addColorStop(0, gradient[0])
      grad.addColorStop(1, gradient[1])
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = bgColor
    }
    this.drawRoundRect(ctx, x, y, w, h, radius)
    ctx.fill()

    ctx.fillStyle = textColor
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x + w / 2, y + h / 2)

    return { x, y, w, h }
  }

  hitTest(x, y, rect) {
    if (!rect) return false
    return x >= rect.x && x <= rect.x + rect.w &&
           y >= rect.y && y <= rect.y + rect.h
  }

  resetCtx(ctx) {
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    ctx.globalAlpha = 1
    ctx.lineWidth = 1
  }
}

module.exports = { GameManager }
