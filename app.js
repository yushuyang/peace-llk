App({
  onLaunch() {
    console.log('太平年连连看 启动')
    wx.getSystemInfo({ success: (res) => { this.globalData.systemInfo = res } })
    this.initStorage()
  },
  initStorage() {
    const bestScore = wx.getStorageSync('bestScore')
    if (!bestScore) wx.setStorageSync('bestScore', 0)
  },
  globalData: { systemInfo: null, gameData: null }
})