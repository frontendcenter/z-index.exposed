/* eslint-disable no-unused-vars */
import store from './store'
const range = document.createRange()

const slice = (...keys) => obj => keys.reduce((accum, k) => ({...accum, [k]: obj[k]}), {})

const toBox = el => {
  let isElement = HTMLElement.isPrototypeOf(el.constructor)
  const style = isElement ? getComputedStyle(el) : {}
  const {
    background,
    border
  } = style

  const rect = isElement ? el.getBoundingClientRect() :
    (range.selectNode(el), range.getBoundingClientRect())

  if (!isElement) {
    console.log(rect)
    console.log(range.getBoundingClientRect())
  }

  console.log(el)
  return {
    ...slice('background', 'border')(style),
    ...slice('top', 'left', 'width', 'height')(rect),
    children: isElement ? null : el.wholeText,
    textIndent: isElement ? 0 : (
      range.setStart(el, 0),
      range.setEnd(el, 1),
      range.getBoundingClientRect().left - rect.left
    )
  }
}

export default element => {
  const rects = [toBox(element)]

  Array.from(element.childNodes)
    .filter(c => c.nodeType !== Node.COMMENT_NODE)
    .forEach(c => {
      rects.push(toBox(c))
    })

  store.rects = rects
}
