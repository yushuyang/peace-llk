Page({
  data: {
    bestScore: 0,
    hasBestScore: false,
    difficulty: 'normal',
    easyActive: '',
    normalActive: 'active',
    hardActive: ''
  },
  onLoad() {
    this.updateBestScore()
  },
  onShow() {
    this.updateBestScore()
  },
  updateBestScore() {
    const bestScore = wx.getStorageSync('bestScore') || 0
    this.setData({
      bestScore: bestScore,
      hasBestScore: bestScore > 0
    })
  },
  startGame() {
    wx.navigateTo({
      url: `/pages/play/play?difficulty=${this.data.difficulty}`
    })
  },
  setDifficulty(e) {
    const difficulty = e.currentTarget.dataset.level
    this.setData({
      difficulty: difficulty,
      easyActive: difficulty === 'easy' ? 'active' : '',
      normalActive: difficulty === 'normal' ? 'active' : '',
      hardActive: difficulty === 'hard' ? 'active' : ''
    })
  },
  showHelp() {
    wx.showModal({
      title: '游戏说明',
      content: '太平年连连看\n\n1. 点击两个相同的角色头像进行消除\n2. 连接路径不能超过3条直线\n3. 在时间内消除所有卡片获胜\n4. 点击已选中的角色可查看详细信息\n5. 时间越短，得分越高！\n\n角色来源：电视剧《太平年》\n钱弘俶、赵匡胤、郭荣、冯道等历史人物',
      showCancel: false
    })
  },
  showCharacters() {
    wx.navigateTo({ url: '/pages/characters/characters' })
  }
})