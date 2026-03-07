Page({
  data: {
    isWin: false,
    score: 0,
    usedTime: 0,
    isNewRecord: false,
    resultTitle: '游戏结束',
    formattedTime: '00:00'
  },
  onLoad(options) {
    const isWin = options.won === 'true'
    const score = parseInt(options.score) || 0
    const usedTime = parseInt(options.usedTime) || 0

    const bestScore = wx.getStorageSync('bestScore') || 0
    const isNewRecord = score > bestScore

    if (isNewRecord) {
      wx.setStorageSync('bestScore', score)
    }

    this.setData({
      isWin: isWin,
      score: score,
      usedTime: usedTime,
      isNewRecord: isNewRecord,
      resultTitle: isWin ? '恭喜过关！' : '游戏结束',
      formattedTime: this.formatTime(usedTime)
    })
  },
  playAgain() {
    wx.redirectTo({ url: '/pages/play/play' })
  },
  backToMenu() {
    wx.redirectTo({ url: '/pages/index/index' })
  },
  formatTime(s) {
    const m = Math.floor(s / 60)
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  }
})