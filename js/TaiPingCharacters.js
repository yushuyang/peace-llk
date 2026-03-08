/**
 * 《太平年》角色数据
 * 基于电视剧真实角色，使用外部图片素材
 */
const TAI_PING_CHARACTERS = [
  {
    id: 1,
    name: '钱弘俶',
    actor: '白宇',
    title: '吴越末代君主',
    desc: '字文德，小字虎子，谥"忠懿"',
    image: '/images/char01.png'
  },
  {
    id: 2,
    name: '赵匡胤',
    actor: '朱亚文',
    title: '宋太祖',
    desc: '小名香孩儿，宋朝开国皇帝',
    image: '/images/char02.png'
  },
  {
    id: 3,
    name: '郭荣',
    actor: '俞灏明',
    title: '后周世宗',
    desc: '随养父郭威改姓郭',
    image: '/images/char03.png'
  },
  {
    id: 4,
    name: '冯道',
    actor: '董勇',
    title: '四朝元老',
    desc: '字可道，号长乐老，谥"文懿"',
    image: '/images/char04.png'
  },
  {
    id: 5,
    name: '郭威',
    actor: '蒋恺',
    title: '后周太祖',
    desc: '字文仲，郭荣姑父兼养父',
    image: '/images/char05.png'
  },
  {
    id: 6,
    name: '钱元瓘',
    actor: '尤勇智',
    title: '吴越文穆王',
    desc: '字明宝，钱俶父，吴越国二代国王',
    image: '/images/char06.png'
  },
  {
    id: 7,
    name: '刘知远',
    actor: '于洋',
    title: '后汉高祖',
    desc: '后汉开国皇帝，更名刘暠',
    image: '/images/char07.png'
  },
  {
    id: 8,
    name: '钱弘佐',
    actor: '吴昊宸',
    title: '吴越忠献王',
    desc: '字元佑，吴越国第三代国王',
    image: '/images/char08.png'
  },
  {
    id: 9,
    name: '石敬瑭',
    actor: '海一天',
    title: '后晋高祖',
    desc: '"儿皇帝"，割让幽云十六州',
    image: '/images/char09.png'
  },
  {
    id: 10,
    name: '孙太真',
    actor: '待补充',
    title: '钱弘俶妻',
    desc: '受母命留居杭州陪伴钱弘俶',
    image: '/images/char10.png'
  },
  {
    id: 11,
    name: '李煜',
    actor: '牛超',
    title: '南唐后主',
    desc: '本名从嘉，字重光',
    image: '/images/char11.png'
  }
]

/**
 * 获取角色总数
 */
function getCharacterCount() {
  return TAI_PING_CHARACTERS.length
}

/**
 * 根据ID获取角色
 */
function getCharacterById(id) {
  return TAI_PING_CHARACTERS.find(c => c.id === id) || TAI_PING_CHARACTERS[0]
}

/**
 * 获取所有角色
 */
function getAllCharacters() {
  return TAI_PING_CHARACTERS
}

/**
 * 随机获取指定数量的角色（不重复）
 */
function getRandomCharacters(count) {
  const shuffled = [...TAI_PING_CHARACTERS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

module.exports = {
  TAI_PING_CHARACTERS,
  getCharacterCount,
  getCharacterById,
  getAllCharacters,
  getRandomCharacters
}