import React from 'react'
import styled from 'styled-components'
import calcOrder, { translate } from './calcOrder'
import AceEditor from 'react-ace'
import 'brace/mode/html'
import 'brace/theme/chrome'
import 'brace/ext/emmet'
import store from './store'
import { observer } from 'mobx-react'
import { link } from './styles'
import { navigate, trim } from './store'
import { action } from 'mobx'
import FlipMove from 'react-flip-move'
import objectHash from 'object-hash'

const Outer = styled.div`
  margin: 1rem;
  transform: translateZ(0);
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
`

const Code = styled.div`
  flex: 1 0 14rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
`

const Box = Code.extend`
  transform: translate3d(0,0,0);
`

const Order = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  
  > ol {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0.5rem 0.5rem;
    margin: 1rem;
    background: white;
    border: 1px solid #ccc;
  }
  width: 100%;
  text-align: center;
`

const Square = styled.li`
  width: 3rem;
  height: 3rem;
  margin: 1rem 1rem;
  background: ${props => props.background};
  border: ${props => props.border};
  display: flex;
  align-items: center;
  box-shadow: ${props => props.sc ? '0 0 0 2px white, 0 0 0 3px black' : '0 0 4px 1px #eee' };
  font-size: 0.75rem;
  padding: 0.25rem;
`

const Label = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Ace = styled(AceEditor).attrs({
  width: '100%',
  height: '18rem',
  mode: 'html',
  theme: 'chrome',
  fontSize: '16px',
  tabSize: 2,
  showPrintMargin: false,
  setOptions: {
    enableEmmet: true
  },
  editorProps: {
    $blockScrolling: true,
    blockScrolling: true,
    autoScrollEditorIntoView: false,
    setScrollSpeed: 0
  }
})`
  border: 1px solid #ccc;
  .ace_gutter-cell.ace_info { background: none; }
  .ace_tooltip { display: none !important; }
  min-width: 14rem;
`

const Link = styled.a`
  ${link}
`

const addHash = order => {
  const collisions = new Map()
  const res = order.map(({el, ...box}) => {
    const hash = objectHash(box)
    const nr = collisions.get(hash) || 0
    collisions.set(hash, nr+1)
    return {el, ...box, key: `${hash}-${nr}`}
  })
  console.log({order, res})
  return res
}

const report = (num) => `https://github.com/frontendcenter/z-index.exposed/issues/new?title=${
  encodeURIComponent(`[BUG—ORDERING] Example ${num}`)
}&body=${
  encodeURIComponent(`Current code:\n\n\`\`\`html\n${store.demo.code}\n\`\`\`\n\nCalculated order: \`${translate(store.demo.order).join(' · ') }\``)
}`

class Demo extends React.Component {
  constructor(props) {
    super()
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps(props) {
    store.demo.code = trim(props.code)
    this.changeCode(store.demo.code)
  }

  componentDidMount() {
    this.changeCode(store.demo.code)
  }

  changeCode = code => {
    store.demo.code = code
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        store.demo.order = addHash(calcOrder(this.el))
      })
    })
  }

  render() {
    return <Outer>
      <Code>
        <Ace name={`ace-editor-${this.props.num})`}
             value={store.demo.code}
             onChange={this.changeCode}/>
        {/*<Reset>Reset</Reset> · <ShowCSS>Show CSS</ShowCSS>*/}
      </Code>
      <Box>
        <div className="Container" ref={el => this.el = el}
             dangerouslySetInnerHTML={{ __html: store.demo.code }}/>
      </Box>
      <Order>
        <span>Order of rendering:</span>
        <FlipMove typeName="ol"
                  enterAnimation="fade"
                  staggerDelayBy={100}
                  duration={300}
                  leaveAnimation="none">
          { store.demo.order.map((e, i) => (
            <Square key={e.key} {...e}>
              {e.text && <Label>{e.text}</Label>}
            </Square>
          )) }
        </FlipMove>
        <span>Something not look
          right? <Link href={report(this.props.num)} target="_blank">Open an issue</Link>.
        </span>
      </Order>
    </Outer>
  }
}

export default observer(Demo)
