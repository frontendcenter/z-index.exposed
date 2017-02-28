const orderedFlatten = obj => (
  Object.keys(obj).sort((a, b) => a > b).reduce((a, k) => (
    [...a, ...obj[k].reduce((a, p) => a.concat(p.flatten()), [])]
  ), [])
)

const mergeInto = accum => obj => (
  Object.keys(obj).forEach(k => {
    accum[k] = [...(accum[k] || []), ...obj[k]]
  })
)

class Context {
  base = []
  blocks = []
  inlines = []
  positioneds = {
    negative: {},
    auto: [],
    positive: {}
  }

  constructor(sc) {
    this.sc = sc
  }

  debug() {
    const el = x => x.el
    const recurse = obj => Object.keys(obj).reduce((a, k) => ({
      ...a,
      [k]: obj[k].map(x => x.debug())
    }), {})
    return [
      this.base.map(el),
      recurse(this.positioneds.negative),
      this.blocks.map(el),
      this.inlines.map(el),
      this.positioneds.auto.map(el),
      recurse(this.positioneds.positive),
    ]
  }

  flatten(ignorePosNegs = false, ignoreBase = false) {
    return [
      ...this.base,
      ...(this.sc ? orderedFlatten(this.flattenThrough('negative')) : []),
      ...this.blocks,
      ...this.inlines,
      ...this.positioneds.auto.reduce((a, p) => a.concat(p.flatten()), []),
      ...(this.sc ? orderedFlatten(this.flattenThrough('positive')) : []),
    ]
  }

  flattenThrough(type) {
    const accum = {}
    const merge = mergeInto(accum)
    merge(this.positioneds[type])
    this.positioneds.auto.forEach(p => !p.sc && merge(p.positioneds[type]))
    return accum
  }

  addBase(b) {
    this.base.push(b)
  }

  addBlock(r) {
    this.blocks.push(r)
  }

  addInline(t) {
    this.inlines.push(t)
  }

  addPositioned(p, zIndex) {
    if (zIndex === "auto" || zIndex == "0") {
      this.positioneds.auto.push(p)
    } else {
      const z = parseInt(zIndex, 10)
      if (z < 0) {
        this.positioneds.negative[z] = [...(this.positioneds.negative[z] || []), p]
      } else if (z > 0) {
        this.positioneds.positive[z] = [...(this.positioneds.positive[z] || []), p]
      } else {
        throw new Error(`zIndex NaN ${zIndex}`)
      }
    }
  }
}

const calcOrder = (el, context) => {
  if (el.nodeType === Node.COMMENT_NODE) return

  const isElement = el.nodeType === Node.ELEMENT_NODE
  if (!isElement) {
    if (!/^\s*$/g.exec(el.textContent)) {
      context.addInline({ text: el.textContent, el })
    }
    return
  }

  const style = getComputedStyle(el)

  const me = {
    background: style.background,
    border: style.border,
    el
  }

  let sub = context
  let position = style.position || "static"
  if (position !== "static") {
    const zIndex = style.zIndex || "auto"
    const sc = (zIndex !== "auto")
    me.sc = sc
    sub = new Context(sc)
    sc ? sub.addBase(me) : sub.addBlock(me)
    context.addPositioned(sub, zIndex)
  } else {
    context.addBlock(me)
  }

  el.childNodes.forEach(c => calcOrder(c, sub))
}

export default (el) => {
  const root = new Context(true)
  calcOrder(el, root)
  /* Drop the first element (the frame SC) */
  return root.flatten().slice(1)
}

/* Used for testing & bug submissions */
export const translate = arr => arr.map(({ text, el, sc }) => (
  text ? `'${text.trim()}'` : [
      sc ? '!' : '',
      el.tagName.toLowerCase(),
      ['', ...Array.from(el.classList)].join('.')
    ].join('')
))
