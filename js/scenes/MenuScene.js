/**
 * 菜单场景 - 关卡选择
 */
import { getAllLevels, isLevelUnlocked } from '../LevelConfig.js'

const CHAPTERS = [
  { id: 1, title: '第一章', subtitle: '新手入门',   range: [1, 10] },
  { id: 2, title: '第二章', subtitle: '初级挑战',   range: [11, 20] },
  { id: 3, title: '第三章', subtitle: '中级进阶',   range: [21, 30] },
  { id: 4, title: '第四章', subtitle: '高手之路',   range: [31, 40] },
  { id: 5, title: '第五章', subtitle: '精英突破',   range: [41, 50] },
  { id: 6, title: '第六章', subtitle: '大师考验',   range: [51, 60] },
  { id: 7, title: '第七章', subtitle: '宗师境界',   range: [61, 70] },
  { id: 8, title: '第八章', subtitle: '传说之路',   range: [71, 80] },
  { id: 9, title: '第九章', subtitle: '神话挑战',   range: [81, 90] },
  { id: 10, title: '第十章', subtitle: '登峰造极', range: [91, 100] }
]

class MenuScene {
  constructor(gm) {
    this.gm = gm
    this.currentChapter = 1
    this.levels = []
    this.totalStars = 0
    this.maxStars = 0
    this.levelButtons = []
    this.prevBtn = null
    this.nextBtn = null
  }

  enter() {
    this.refreshData()
    this.render()
  }

  leave() {}

  refreshData() {
    const progress = this.gm.getLevelProgress()
    const allLevels = getAllLevels()
    const chapter = CHAPTERS.find(c => c.id === this.currentChapter)
    if (!chapter) return

    // 总星数
    this.totalStars = 0
    for (const key in progress) {
      if (progress[key] && progress[key].stars) {
        this.totalStars += progress[key].stars
      }
    }
    this.maxStars = allLevels.length * 3

    // 当前章节关卡
    this.levels = []
    for (let l = chapter.range[0]; l <= chapter.range[1]; l++) {
      const cfg = allLevels.find(c => c.level === l)
      if (!cfg) continue
      const unlocked = isLevelUnlocked(l, progress)
      const record = progress[l] || null
      this.levels.push({
        level: l,
        name: cfg.name,
        rows: cfg.rows,
        cols: cfg.cols,
        unlocked,
        stars: record ? record.stars : 0
      })
    }
  }

  render() {
    const ctx = this.gm.ctx
    const W = this.gm.screenWidth
    const H = this.gm.screenHeight
    this.gm.resetCtx(ctx)

    // 背景渐变
    this.gm.drawGradientBg(ctx, W, H)

    // ===== 标题 =====
    ctx.shadowColor = 'rgba(0,0,0,0.3)'
    ctx.shadowBlur = 8
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('太平年连连看', W / 2, 45)
    ctx.shadowBlur = 0

    // ===== 星数 =====
    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(`总星数: ${this.totalStars} / ${this.maxStars} ⭐`, W / 2, 78)

    // ===== 章节导航 =====
    const chapter = CHAPTERS.find(c => c.id === this.currentChapter)
    const navY = 105
    const navH = 40
    const arrowW = 44

    // 左箭头
    this.prevBtn = this.gm.drawButton(ctx, 12, navY, arrowW, navH, '◀', {
      bgColor: this.currentChapter > 1 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
      textColor: this.currentChapter > 1 ? '#fff' : 'rgba(255,255,255,0.4)',
      fontSize: 18,
      radius: 10
    })

    // 右箭头
    this.nextBtn = this.gm.drawButton(ctx, W - 12 - arrowW, navY, arrowW, navH, '▶', {
      bgColor: this.currentChapter < 10 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
      textColor: this.currentChapter < 10 ? '#fff' : 'rgba(255,255,255,0.4)',
      fontSize: 18,
      radius: 10
    })

    // 章节标题
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 17px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${chapter.title} · ${chapter.subtitle}`, W / 2, navY + navH / 2)

    // 章节星数
    let chStars = 0
    const progress = this.gm.getLevelProgress()
    for (let l = chapter.range[0]; l <= chapter.range[1]; l++) {
      if (progress[l]) chStars += progress[l].stars
    }
    const chMax = (chapter.range[1] - chapter.range[0] + 1) * 3
    ctx.font = '11px sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText(`${chStars}/${chMax} ★`, W / 2, navY + navH + 14)

    // ===== 关卡网格 =====
    const gridStartY = navY + navH + 35
    const gridPadX = 14
    const gap = 10
    const cols = 5
    const itemW = Math.floor((W - gridPadX * 2 - gap * (cols - 1)) / cols)
    const itemH = 88

    this.levelButtons = []

    for (let i = 0; i < this.levels.length; i++) {
      const lvl = this.levels[i]
      const c = i % cols
      const r = Math.floor(i / cols)
      const x = gridPadX + c * (itemW + gap)
      const y = gridStartY + r * (itemH + gap)

      this.levelButtons.push({ x, y, w: itemW, h: itemH, level: lvl.level, unlocked: lvl.unlocked })

      // 卡片背景
      if (lvl.unlocked) {
        const grad = ctx.createLinearGradient(x, y, x + itemW, y + itemH)
        grad.addColorStop(0, '#667eea')
        grad.addColorStop(1, '#764ba2')
        ctx.fillStyle = grad
      } else {
        ctx.fillStyle = '#999'
      }
      this.gm.drawRoundRect(ctx, x, y, itemW, itemH, 12)
      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (!lvl.unlocked) {
        // 锁定
        ctx.font = '22px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText('🔒', x + itemW / 2, y + 32)
        ctx.font = '11px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fillText(String(lvl.level), x + itemW / 2, y + 60)
      } else {
        // 关卡号
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 24px sans-serif'
        ctx.fillText(String(lvl.level), x + itemW / 2, y + 22)

        // 关卡名
        ctx.font = '10px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fillText(lvl.name, x + itemW / 2, y + 44)

        // 星星
        const starY = y + 60
        for (let s = 0; s < 3; s++) {
          ctx.fillStyle = s < lvl.stars ? '#FFD700' : 'rgba(255,255,255,0.35)'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('★', x + itemW / 2 - 16 + s * 16, starY)
        }

        // 棋盘尺寸
        ctx.font = '9px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.textAlign = 'center'
        ctx.fillText(`${lvl.rows}×${lvl.cols}`, x + itemW / 2, y + 78)
      }
    }
  }

  onTouchStart(x, y) {}

  onTouchEnd(x, y) {
    // 左箭头
    if (this.gm.hitTest(x, y, this.prevBtn) && this.currentChapter > 1) {
      this.currentChapter--
      this.refreshData()
      this.render()
      return
    }
    // 右箭头
    if (this.gm.hitTest(x, y, this.nextBtn) && this.currentChapter < 10) {
      this.currentChapter++
      this.refreshData()
      this.render()
      return
    }
    // 关卡按钮
    for (const btn of this.levelButtons) {
      if (this.gm.hitTest(x, y, btn)) {
        if (!btn.unlocked) {
          wx.showToast({ title: '请先通过前一关', icon: 'none' })
          return
        }
        this.gm.switchScene('game', { level: btn.level })
        return
      }
    }
  }

  onTouchMove(x, y) {}
}

module.exports = { MenuScene }
