/**
 * 结果场景 - 显示关卡通关/失败结果
 */
import { getLevelConfig, getMaxLevel } from '../LevelConfig.js'

export class ResultScene {
  constructor(gm) {
    this.gm = gm
    this.reset()
  }

  reset() {
    this.isWin = false
    this.score = 0
    this.usedTime = 0
    this.level = 1
    this.stars = 0
    this.levelName = ''
    this.isNewRecord = false
    this.hasNextLevel = false

    this.nextBtn = null
    this.retryBtn = null
    this.menuBtn = null
  }

  enter(params) {
    this.reset()
    this.isWin = params.won || false
    this.score = params.score || 0
    this.usedTime = params.usedTime || 0
    this.level = params.level || 1
    this.stars = params.stars || 0
    this.isNewRecord = params.isNewRecord || false

    const config = getLevelConfig(this.level)
    this.levelName = config ? config.name : ''
    this.hasNextLevel = this.isWin && this.level < getMaxLevel()

    this.render()
  }

  leave() {}

  render() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight
    this.gm.resetCtx(ctx)

    // 背景
    this.gm.drawGradientBg(ctx, W, H)

    // 卡片
    const cardW = 280
    const cardH = this.hasNextLevel ? 430 : 390
    const mx = (W - cardW) / 2
    const my = (H - cardH) / 2
    this.gm.fillRoundRect(ctx, mx, my, cardW, cardH, 20, '#fff')

    let yPos = my + 38

    // 标题
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#667eea'
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(this.isWin ? '🎉 恭喜过关！' : '💪 再接再厉', W / 2, yPos)
    yPos += 32

    // 关卡名
    ctx.fillStyle = '#999'
    ctx.font = '14px sans-serif'
    ctx.fillText(`第${this.level}关 · ${this.levelName}`, W / 2, yPos)
    yPos += 38

    // 星星（通关时显示）
    if (this.isWin) {
      const starSize = 32
      const starGap = 12
      const totalW = 3 * starSize + 2 * starGap
      const startX = W / 2 - totalW / 2

      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < this.stars ? '#FFD700' : '#ddd'
        ctx.font = `${starSize}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText('★', startX + i * (starSize + starGap), yPos)
      }
      ctx.textAlign = 'center'
      yPos += 48
    }

    // 分数
    ctx.fillStyle = '#555'
    ctx.font = '16px sans-serif'
    ctx.fillText(`最终得分: ${this.score}`, W / 2, yPos)
    yPos += 28

    // 用时
    const m = Math.floor(this.usedTime / 60)
    const s = this.usedTime % 60
    const timeStr = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    ctx.fillText(`用时: ${timeStr}`, W / 2, yPos)
    yPos += 32

    // 新纪录
    if (this.isNewRecord) {
      const nrW = 160
      const nrH = 32
      const nrX = (W - nrW) / 2
      const grad = ctx.createLinearGradient(nrX, yPos - 16, nrX + nrW, yPos + 16)
      grad.addColorStop(0, '#f093fb')
      grad.addColorStop(1, '#f5576c')
      ctx.fillStyle = grad
      this.gm.drawRoundRect(ctx, nrX, yPos - 16, nrW, nrH, 16)
      ctx.fill()

      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px sans-serif'
      ctx.fillText('🏆 新纪录！', W / 2, yPos)
      yPos += 38
    }

    // 按钮
    const btnW = 200
    const btnH = 40
    const btnX = (W - btnW) / 2
    yPos += 8

    if (this.hasNextLevel) {
      this.nextBtn = this.gm.drawButton(ctx, btnX, yPos, btnW, btnH, '下一关', {
        gradient: ['#667eea', '#764ba2'], fontSize: 16
      })
      yPos += btnH + 12
    }

    this.retryBtn = this.gm.drawButton(ctx, btnX, yPos, btnW, btnH, '再来一次', {
      bgColor: this.hasNextLevel ? '#f0f0f0' : '#667eea',
      textColor: this.hasNextLevel ? '#666' : '#fff',
      fontSize: 16,
      gradient: this.hasNextLevel ? null : ['#667eea', '#764ba2']
    })
    yPos += btnH + 12

    this.menuBtn = this.gm.drawButton(ctx, btnX, yPos, btnW, btnH, '返回菜单', {
      bgColor: '#f0f0f0', textColor: '#666', fontSize: 16
    })
  }

  onTouchStart(x, y) {}

  onTouchEnd(x, y) {
    if (this.gm.hitTest(x, y, this.nextBtn)) {
      this.gm.switchScene('game', { level: this.level + 1 })
      return
    }
    if (this.gm.hitTest(x, y, this.retryBtn)) {
      this.gm.switchScene('game', { level: this.level })
      return
    }
    if (this.gm.hitTest(x, y, this.menuBtn)) {
      this.gm.switchScene('menu')
      return
    }
  }

  onTouchMove(x, y) {}
}
