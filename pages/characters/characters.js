import { getAllCharacters } from '../../js/TaiPingCharacters.js'

Page({
  data: {
    characters: [],
    showDetail: false,
    detailImage: '',
    detailName: '',
    detailTitle: '',
    detailActor: '',
    detailDesc: ''
  },

  _allCharacters: [],

  onLoad() {
    this._allCharacters = getAllCharacters()
    // 只传入可序列化的简单字段数组给渲染层
    const simpleList = this._allCharacters.map(c => ({
      id: c.id,
      name: c.name || '',
      title: c.title || '',
      actor: c.actor || '',
      image: c.image || ''
    }))
    this.setData({ characters: simpleList })
  },

  showCharacterDetail(e) {
    const index = e.currentTarget.dataset.index
    const character = this._allCharacters[index]
    if (!character) return
    this.setData({
      showDetail: true,
      detailImage: character.image || '',
      detailName: character.name || '',
      detailTitle: character.title || '',
      detailActor: character.actor || '',
      detailDesc: character.desc || ''
    })
  },

  hideDetail() {
    this.setData({
      showDetail: false,
      detailImage: '',
      detailName: '',
      detailTitle: '',
      detailActor: '',
      detailDesc: ''
    })
  },

  preventHide(e) {
    e.stopPropagation()
  },

  backToMenu() {
    wx.navigateBack()
  }
})