import React from 'react'
import styled from 'styled-components'
import store from './store'
import { observer } from 'mobx-react'
import { autorun } from 'mobx'

const Outer = styled.div`
  position: absolute;
  top: 0;
  left: 300px;
  z-index: 1;
`

const Rect = styled.div.attrs({
  style: props => props
})`
  position: absolute;
  box-shadow: inset 0 0 0 1px red;
`
autorun(() => {
  console.log(Array.from(store.rects))
})

export default observer(() => (
  <Outer>
    { store.rects.map((r,i) => (
      <Rect key={i} {...r}/>
    )) }
  </Outer>
))
