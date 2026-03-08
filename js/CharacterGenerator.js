/**
 * 《太真》角色生成器
 * 基于电视剧真实角色创建卡通形象
 */
import { TAI_PING_CHARACTERS, getCharacterById } from './TaiPingCharacters.js'

class CharacterGenerator {
  constructor() {
    // 使用《太真》真实角色数据
    this.characters = TAI_PING_CHARACTERS
  }
  
  /**
   * 获取所有角色
   */
  getAllCharacters() {
    return this.characters
  }
  
  /**
   * 生成游戏用角色（返回指定数量）
   */
  generateCharacters(count) {
    // 返回前count个角色（或全部如果count大于总数）
    return this.characters.slice(0, Math.min(count, this.characters.length))
  }
  
  /**
   * 在Canvas上绘制角色头像
   */
  drawCharacter(ctx, x, y, size, characterOrId) {
    // 支持传入角色对象或ID
    const char = typeof characterOrId === 'number' 
      ? getCharacterById(characterOrId)
      : (characterOrId || this.characters[0])
    
    const traits = char.traits || char
    const cx = x + size / 2
    const cy = y + size / 2
    const r = size * 0.35
    
    // 绘制背景卡片
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size)
    gradient.addColorStop(0, '#f5f5f5')
    gradient.addColorStop(1, '#e0e0e0')
    ctx.fillStyle = gradient
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4)
    
    // 绘制边框
    ctx.strokeStyle = traits.clothesColor || '#666'
    ctx.lineWidth = 3
    ctx.strokeRect(x + 2, y + 2, size - 4, size - 4)
    
    // 绘制脸型
    ctx.fillStyle = traits.skinColor || '#FDBF60'
    ctx.beginPath()
    if (traits.faceShape === 0) {
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
    } else if (traits.faceShape === 1) {
      ctx.ellipse(cx, cy, r, r * 1.15, 0, 0, Math.PI * 2)
    } else {
      ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * 0.3)
    }
    ctx.fill()
    
    // 绘制脸部轮廓线
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'
    ctx.lineWidth = 1
    ctx.stroke()
    
    // 绘制眼睛
    this.drawEyes(ctx, cx, cy, r, traits)
    
    // 绘制眉毛
    this.drawEyebrows(ctx, cx, cy, r, traits)
    
    // 绘制嘴巴
    this.drawMouth(ctx, cx, cy, r, traits)
    
    // 绘制头发/头饰
    this.drawHair(ctx, cx, cy, r, traits)
    
    // 绘制装饰
    this.drawAccessory(ctx, cx, cy, r, traits)
    
    // 绘制名字标签（小字）
    ctx.fillStyle = '#333'
    ctx.font = `bold ${Math.max(10, size * 0.15)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText(char.name, cx, y + size - 5)
  }
  
  /**
   * 绘制眼睛
   */
  drawEyes(ctx, cx, cy, r, traits) {
    const eyeSize = r * 0.12
    const eyeSpacing = r * 0.35
    const eyeY = cy - r * 0.05
    
    // 眼白
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.arc(cx - eyeSpacing, eyeY, eyeSize * 1.2, 0, Math.PI * 2)
    ctx.arc(cx + eyeSpacing, eyeY, eyeSize * 1.2, 0, Math.PI * 2)
    ctx.fill()
    
    // 眼珠
    ctx.fillStyle = traits.eyeColor || '#000'
    ctx.beginPath()
    ctx.arc(cx - eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2)
    ctx.arc(cx + eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    
    // 高光
    ctx.fillStyle = '#FFF'
    ctx.beginPath()
    ctx.arc(cx - eyeSpacing + eyeSize * 0.4, eyeY - eyeSize * 0.3, eyeSize * 0.3, 0, Math.PI * 2)
    ctx.arc(cx + eyeSpacing + eyeSize * 0.4, eyeY - eyeSize * 0.3, eyeSize * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 绘制眉毛
   */
  drawEyebrows(ctx, cx, cy, r, traits) {
    const browY = cy - r * 0.25
    const browSpacing = r * 0.35
    const browWidth = r * 0.25
    
    ctx.strokeStyle = traits.hairColor || '#000'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    
    // 根据表情调整眉毛
    let leftBrowEndY = browY
    let rightBrowEndY = browY
    
    switch(traits.expression) {
      case 'serious':
        leftBrowEndY -= 3
        rightBrowEndY -= 3
        break
      case 'happy':
      case 'smile':
        leftBrowEndY += 2
        rightBrowEndY += 2
        break
    }
    
    // 左眉毛
    ctx.beginPath()
    ctx.moveTo(cx - browSpacing - browWidth, browY)
    ctx.lineTo(cx - browSpacing + browWidth, leftBrowEndY)
    ctx.stroke()
    
    // 右眉毛
    ctx.beginPath()
    ctx.moveTo(cx + browSpacing - browWidth, rightBrowEndY)
    ctx.lineTo(cx + browSpacing + browWidth, browY)
    ctx.stroke()
  }
  
  /**
   * 绘制嘴巴
   */
  drawMouth(ctx, cx, cy, r, traits) {
    const mouthY = cy + r * 0.25
    
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    
    switch(traits.expression) {
      case 'smile':
      case 'happy':
        ctx.arc(cx, mouthY - 3, r * 0.2, 0.2, Math.PI - 0.2)
        break
      case 'serious':
        ctx.moveTo(cx - r * 0.12, mouthY)
        ctx.lineTo(cx + r * 0.12, mouthY)
        break
      case 'calm':
      default:
        ctx.arc(cx, mouthY - 2, r * 0.15, 0.3, Math.PI - 0.3)
    }
    ctx.stroke()
  }
  
  /**
   * 绘制头发/头饰
   */
  drawHair(ctx, cx, cy, r, traits) {
    ctx.fillStyle = traits.hairColor || '#000'
    
    switch(traits.hairstyle) {
      case 'short':
        this.drawShortHair(ctx, cx, cy, r)
        break
      case 'long':
        this.drawLongHair(ctx, cx, cy, r)
        break
      case 'ponytail':
        this.drawPonytail(ctx, cx, cy, r)
        break
      case 'bald':
        // 光头不画头发
        break
      case 'hat':
        this.drawHat(ctx, cx, cy, r, traits.clothesColor)
        break
      case 'crown':
        this.drawCrown(ctx, cx, cy, r)
        break
      default:
        this.drawShortHair(ctx, cx, cy, r)
    }
  }
  
  /**
   * 短发
   */
  drawShortHair(ctx, cx, cy, r) {
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.2, r * 1.05, Math.PI, 0)
    ctx.lineTo(cx + r * 0.9, cy + r * 0.2)
    ctx.lineTo(cx - r * 0.9, cy + r * 0.2)
    ctx.closePath()
    ctx.fill()
  }
  
  /**
   * 长发（女性）
   */
  drawLongHair(ctx, cx, cy, r) {
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.2, r * 1.05, Math.PI, 0)
    ctx.lineTo(cx + r * 1.1, cy + r * 1.3)
    ctx.quadraticCurveTo(cx, cy + r * 1.5, cx - r * 1.1, cy + r * 1.3)
    ctx.closePath()
    ctx.fill()
  }
  
  /**
   * 马尾
   */
  drawPonytail(ctx, cx, cy, r) {
    // 头顶头发
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.2, r * 1.05, Math.PI, 0)
    ctx.lineTo(cx + r * 0.9, cy + r * 0.2)
    ctx.lineTo(cx - r * 0.9, cy + r * 0.2)
    ctx.closePath()
    ctx.fill()
    
    // 马尾
    ctx.beginPath()
    ctx.ellipse(cx, cy - r * 1.2, r * 0.25, r * 0.6, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 官帽
   */
  drawHat(ctx, cx, cy, r, color) {
    // 帽檐
    ctx.fillStyle = color || '#8B4513'
    ctx.beginPath()
    ctx.ellipse(cx, cy - r * 0.7, r * 1.2, r * 0.25, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 帽顶
    ctx.fillStyle = this.darkenColor(color || '#8B4513', 20)
    ctx.beginPath()
    ctx.ellipse(cx, cy - r * 1.0, r * 0.7, r * 0.3, 0, 0, Math.PI, true)
    ctx.closePath()
    ctx.fill()
    
    // 帽饰
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.7, r * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 皇冠（君王）
   */
  drawCrown(ctx, cx, cy, r) {
    // 皇冠底座
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(cx - r * 0.9, cy - r * 1.0, r * 1.8, r * 0.35)
    
    // 皇冠尖顶
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.9, cy - r * 1.0)
    ctx.lineTo(cx - r * 0.4, cy - r * 1.5)
    ctx.lineTo(cx, cy - r * 1.0)
    ctx.lineTo(cx + r * 0.4, cy - r * 1.5)
    ctx.lineTo(cx + r * 0.9, cy - r * 1.0)
    ctx.closePath()
    ctx.fill()
    
    // 宝石装饰
    ctx.fillStyle = '#DC143C'
    ctx.beginPath()
    ctx.arc(cx, cy - r * 1.2, r * 0.12, 0, Math.PI * 2)
    ctx.fill()
    
    // 侧边宝石
    ctx.beginPath()
    ctx.arc(cx - r * 0.6, cy - r * 1.15, r * 0.08, 0, Math.PI * 2)
    ctx.arc(cx + r * 0.6, cy - r * 1.15, r * 0.08, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 绘制装饰
   */
  drawAccessory(ctx, cx, cy, r, traits) {
    switch(traits.accessory) {
      case 'glasses':
        this.drawGlasses(ctx, cx, cy, r)
        break
      case 'beard':
        this.drawBeard(ctx, cx, cy, r, traits.hairColor)
        break
      case 'headband':
        this.drawHeadband(ctx, cx, cy, r, traits.clothesColor)
        break
      case 'earrings':
        this.drawEarrings(ctx, cx, cy, r)
        break
    }
  }
  
  /**
   * 眼镜
   */
  drawGlasses(ctx, cx, cy, r) {
    const eyeY = cy - r * 0.05
    const eyeSpacing = r * 0.35
    const glassRadius = r * 0.18
    
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    
    ctx.beginPath()
    ctx.arc(cx - eyeSpacing, eyeY, glassRadius, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.arc(cx + eyeSpacing, eyeY, glassRadius, 0, Math.PI * 2)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(cx - eyeSpacing + glassRadius, eyeY)
    ctx.lineTo(cx + eyeSpacing - glassRadius, eyeY)
    ctx.stroke()
  }
  
  /**
   * 胡须
   */
  drawBeard(ctx, cx, cy, r, hairColor) {
    ctx.fillStyle = hairColor || '#4A3728'
    
    // 山羊胡
    ctx.beginPath()
    ctx.ellipse(cx, cy + r * 0.45, r * 0.18, r * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // 上唇胡须
    ctx.fillStyle = hairColor || '#4A3728'
    ctx.beginPath()
    ctx.ellipse(cx, cy + r * 0.25, r * 0.15, r * 0.08, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 发带
   */
  drawHeadband(ctx, cx, cy, r, color) {
    ctx.fillStyle = color || '#DC143C'
    ctx.fillRect(cx - r, cy - r * 0.85, r * 2, r * 0.12)
  }
  
  /**
   * 耳环
   */
  drawEarrings(ctx, cx, cy, r) {
    ctx.fillStyle = '#FFD700'
    
    ctx.beginPath()
    ctx.arc(cx - r * 0.85, cy + r * 0.15, r * 0.06, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(cx + r * 0.85, cy + r * 0.15, r * 0.06, 0, Math.PI * 2)
    ctx.fill()
  }
  
  /**
   * 颜色加深辅助函数
   */
  darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = Math.max((num >> 16) - amt, 0)
    const G = Math.max((num >> 8 & 0x00FF) - amt, 0)
    const B = Math.max((num & 0x0000FF) - amt, 0)
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
  }
}