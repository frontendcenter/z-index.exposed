import demos from './demos'
import { jsdom } from 'jsdom'
import calcOrder, { translate } from './calcOrder'
import fs from 'fs'

const css = fs.readFileSync(__dirname + "/styles.css", "utf-8")

const build = demo => {
  const doc = jsdom(`
    <html>
      <head>
        <style>
          ${css}
          main {
            position: relative;
            z-index: 0;
          }
        </style>
      </head>
      <body>
        <main>
          ${demo}
        </main>
      </body>
    </html>
  `)
  return doc
}

demos.forEach((demo,i) => {
  const {title, code} = demo
  it(`Handles demo ${i + 1}: ${title}`, () => {
    const doc = build(code)
    const order = calcOrder(doc.querySelector('main'))
    expect(translate(order)).toMatchSnapshot()
  })
})
