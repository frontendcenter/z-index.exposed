import { observable, autorun, action } from 'mobx'
import queryfetch from 'queryfetch'

const getPathFromUrl = () => location.toString().split(/[?#]/)[0]
const params = queryfetch(location.search).parse()

const store = observable({
  demo: {
    code: '',
    order: [],
  },
  url: {
    demo: params.demo,
  },
  ui: {
    cssVisible: false
  }
})
let pushState = false

autorun(() => {
  const nonNulls = Object.keys(store.url).reduce((a, k) =>
    store.url[k] ? { ...a, [k]: store.url[k] } : a, {})
  const query = queryfetch(nonNulls).serialize()
  const url = `${getPathFromUrl()}${query ? `?${query}` : ''}`
  if (pushState) {
    pushState = false
    history.pushState({}, null, url)
  } else {
    history.replaceState({}, null, url)
  }
})

export default store

export const navigate = action(query => {
  pushState = true
  Object.keys(query).forEach(q => store.url[q] = query[q])
})

addEventListener('popstate', action(() => {
  const query = queryfetch(location.search).parse()
  new Set([...Object.keys(query), ...Object.keys(store.url)])
    .forEach(q => store.url[q] = query[q])
}))

export const trim = code => code.trim().replace(/^ {6}/gm, '')
