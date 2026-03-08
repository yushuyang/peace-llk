import { getLevelConfig, getMaxLevel } from '../../js/LevelConfig.js'

Page({
  data: {
    isWin: false,
    score: 0,
    usedTime: 0,
    level: 1,
    levelName: '',
    stars: 0,
    star1: false,
    star2: false,
    star3: false,
    isNewRecord: false,
    hasNextLevel: false,
    resultTitle: '游戏结束',
    formattedTime: '00:00'
  },
  onLoad(options) {
    const isWin = options.won === 'true'
    const score = parseInt(options.score) || 0
    const usedTime = parseInt(options.usedTime) || 0
    const level = parseInt(options.level) || 1
    const stars = parseInt(options.stars) || 0

    const config = getLevelConfig(level)
    const levelName = config ? config.name : ''
    const maxLevel = getMaxLevel()

    const app = getApp()
    const progress = app.getLevelProgress()
    const prevBest = progress[level] ? progress[level].bestScore : 0
    const isNewRecord = isWin && score > prevBest

    this.setData({
      isWin,
      score,
      usedTime,
      level,
      levelName,
      stars,
      star1: stars >= 1,
      star2: stars >= 2,
      star3: stars >= 3,
      isNewRecord,
      hasNextLevel: isWin && level < maxLevel,
      resultTitle: isWin ? '🎉 恭喜过关！' : '💪 再接再厉',
      formattedTime: this.formatTime(usedTime)
    })
  },
  playAgain() {
    wx.redirectTo({ url: `/pages/play/play?level=${this.data.level}` })
  },
  nextLevel() {
    const next = this.data.level + 1
    wx.redirectTo({ url: `/pages/play/play?level=${next}` })
  },
  backToMenu() {
    wx.redirectTo({ url: '/pages/index/index' })
  },
  formatTime(s) {
    const m = Math.floor(s / 60)
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }
})