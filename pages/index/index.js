import { getAllLevels, isLevelUnlocked } from '../../js/LevelConfig.js'

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

Page({
  data: {
    chapters: [],
    currentChapter: 1,
    chapterTitle: '',
    chapterSubtitle: '',
    levels: [],
    totalStars: 0,
    maxStars: 0
  },

  onLoad() {
    this.refreshData()
  },

  onShow() {
    this.refreshData()
  },

  refreshData() {
    const app = getApp()
    const progress = app.getLevelProgress()
    const allLevels = getAllLevels()

    // 计算总星数
    let totalStars = 0
    for (const key in progress) {
      if (progress[key] && progress[key].stars) {
        totalStars += progress[key].stars
      }
    }

    // 生成章节列表（带完成度）
    const chapters = CHAPTERS.map(ch => {
      let chStars = 0
      for (let l = ch.range[0]; l <= ch.range[1]; l++) {
        if (progress[l]) chStars += progress[l].stars
      }
      const chMax = (ch.range[1] - ch.range[0] + 1) * 3
      return {
        id: ch.id,
        title: ch.title,
        subtitle: ch.subtitle,
        stars: chStars,
        maxStars: chMax,
        completed: chStars >= chMax
      }
    })

    this.setData({
      chapters,
      totalStars,
      maxStars: allLevels.length * 3
    })

    this.showChapter(this.data.currentChapter, progress, allLevels)
  },

  showChapter(chapterId, progress, allLevels) {
    const chapter = CHAPTERS.find(c => c.id === chapterId)
    if (!chapter) return

    if (!progress) progress = getApp().getLevelProgress()
    if (!allLevels) allLevels = getAllLevels()

    const levels = []
    for (let l = chapter.range[0]; l <= chapter.range[1]; l++) {
      const cfg = allLevels.find(c => c.level === l)
      if (!cfg) continue
      const unlocked = isLevelUnlocked(l, progress)
      const record = progress[l] || null
      levels.push({
        level: l,
        name: cfg.name,
        rows: cfg.rows,
        cols: cfg.cols,
        unlocked,
        stars: record ? record.stars : 0,
        star1: record && record.stars >= 1,
        star2: record && record.stars >= 2,
        star3: record && record.stars >= 3
      })
    }

    this.setData({
      currentChapter: chapterId,
      chapterTitle: chapter.title,
      chapterSubtitle: chapter.subtitle,
      levels
    })
  },

  onChapterTap(e) {
    const chapterId = e.currentTarget.dataset.id
    this.showChapter(chapterId)
  },

  prevChapter() {
    if (this.data.currentChapter > 1) {
      this.showChapter(this.data.currentChapter - 1)
    }
  },

  nextChapter() {
    if (this.data.currentChapter < CHAPTERS.length) {
      this.showChapter(this.data.currentChapter + 1)
    }
  },

  startLevel(e) {
    const level = e.currentTarget.dataset.level
    const unlocked = e.currentTarget.dataset.unlocked
    if (!unlocked) {
      wx.showToast({ title: '请先通过前一关', icon: 'none' })
      return
    }
    wx.navigateTo({
      url: `/pages/play/play?level=${level}`
    })
  },

  showHelp() {
    wx.showModal({
      title: '游戏说明',
      content: '太平年连连看\n\n1. 点击两个相同的角色头像进行消除\n2. 连接路径不能超过3条直线（2个拐角）\n3. 在时间内消除所有卡片获胜\n4. 点击已选中的角色可查看详细信息\n5. 通关获得1-3颗星，解锁下一关！\n\n角色来源：电视剧《太平年》',
      showCancel: false
    })
  },

  showCharacters() {
    wx.navigateTo({ url: '/pages/characters/characters' })
  }
})