// 常量配置
const APISTATUS = {
  ERROR: 500, // 常规错误
  UNAUTHORIZED: 401, // 未登录
  NOMATCH: 404 // 查找的信息找不到
}

// 获取随机串
function getRandomStr () {
  return String(Date.now()) + Math.floor(Math.random() * 10000)
}

function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const hyphenateRE = /\B([A-Z])/g
const hyphenate = cached(str => {
  return str.replace(hyphenateRE, '_$1').toLowerCase()
})

const camelizeRE = /_(\w)/g
const camelize = cached(str => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

// 将对象驼峰字段格式化数据库字段，如appName => app_name
function formatField (obj) {
  if (!obj) return obj
  const res = {}
  for (let key in obj) {
    res[hyphenate(key)] = obj[key]
  }
  return res
}

// 将数据库字段格式化对象驼峰字段，如app_name => appName
function formatKey (obj) {
  if (!obj) return obj
  const res = {}
  for (let key in obj) {
    res[camelize(key)] = obj[key]
  }
  return res
}

module.exports = {
  APISTATUS,
  getRandomStr,
  formatField,
  formatKey
}
