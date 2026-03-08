/**
 * 太平年连连看 - 微信小游戏入口
 */
import { GameManager } from './js/GameManager.js'

// 创建主画布（第一次调用返回全屏显示画布）
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 获取系统信息
const sysInfo = wx.getSystemInfoSync()
const dpr = sysInfo.pixelRatio
const screenWidth = sysInfo.screenWidth
const screenHeight = sysInfo.screenHeight

// 设置画布为物理像素大小，ctx 缩放以使用逻辑像素坐标
canvas.width = screenWidth * dpr
canvas.height = screenHeight * dpr
ctx.scale(dpr, dpr)

// 初始化游戏管理器
const gm = new GameManager(canvas, ctx, screenWidth, screenHeight)
gm.start()

// 注册全局触摸事件
wx.onTouchStart((e) => {
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0]
    gm.onTouchStart(t.clientX, t.clientY)
  }
})

wx.onTouchEnd((e) => {
  if (e.changedTouches && e.changedTouches.length > 0) {
    const t = e.changedTouches[0]
    gm.onTouchEnd(t.clientX, t.clientY)
  }
})

wx.onTouchMove((e) => {
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0]
    gm.onTouchMove(t.clientX, t.clientY)
  }
})
