App({
  onLaunch() {
    console.log('太平年连连看 启动')
    wx.getSystemInfo({ success: (res) => { this.globalData.systemInfo = res } })
    this.initStorage()
  },
  initStorage() {
    // 兼容旧版：保留 bestScore
    const bestScore = wx.getStorageSync('bestScore')
    if (!bestScore) wx.setStorageSync('bestScore', 0)
    // 关卡进度：{ [level]: { stars, bestScore, bestTime } }
    const levelProgress = wx.getStorageSync('levelProgress')
    if (!levelProgress) wx.setStorageSync('levelProgress', {})
  },
  /**
   * 获取关卡进度
   */
  getLevelProgress() {
    return wx.getStorageSync('levelProgress') || {}
  },
  /**
   * 保存单关成绩
   */
  saveLevelResult(level, stars, score, time) {
    const progress = this.getLevelProgress()
    const prev = progress[level] || { stars: 0, bestScore: 0, bestTime: 0 }
    progress[level] = {
      stars: Math.max(prev.stars, stars),
      bestScore: Math.max(prev.bestScore, score),
      bestTime: prev.bestTime > 0 ? Math.min(prev.bestTime, time) : time
    }
    wx.setStorageSync('levelProgress', progress)
  },
  /**
   * 获取当前已解锁的最高关卡
   */
  getUnlockedLevel() {
    const progress = this.getLevelProgress()
    let maxUnlocked = 1
    for (const lvl in progress) {
      const l = parseInt(lvl)
      if (progress[l] && progress[l].stars > 0) {
        maxUnlocked = Math.max(maxUnlocked, l + 1)
      }
    }
    return maxUnlocked
  },
  globalData: { systemInfo: null, gameData: null }
})