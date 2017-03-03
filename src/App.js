import React from 'react'
import styled from 'styled-components'
import demos from './demos'
import Demo from './Demo'
import { observer } from 'mobx-react'
import store, { navigate } from './store'
import Markdown from 'markdown-it'
import { link, typewriter } from './styles'
const md = new Markdown()

const Main = styled.main`
  display: flex;
  flex-wrap: wrap;
  max-width: 960px;
  margin: auto;
  padding: 1rem 1rem;
`

const Title = styled.span`
  font-size: 1.666rem;
  line-height: 1.2;
  ${ typewriter }
`

const Nav = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  text-align: center;
  ${ Title } {
    flex-grow: 1;
    padding: 0 1.5rem;
    &:first-child { margin-left: 4rem; }
    &:last-child { margin-right: 4rem; }
  }
`

const Desc = styled.div`
  width: 35rem;
  margin: 0 auto;
  line-height: 1.5;
  p {
    margin-bottom: 0.5em;
  }
  code {
    background: #eee;
    padding: 0.1em 0.333em;
  }
  pre {
    background: #eee;
    margin: 1em;
    padding: 0.5em;
  }
`
const A = styled.a`
  &, ${Desc} a {
    ${ link }
  }
`
const Link = A.extend.attrs({
  href: '#',
  onClick: props => e => {
    e.preventDefault()
    navigate(props.to)
  }
})`
 margin: 0rem; 
 width: 4rem;
`

const Header = styled.div`
  min-height: 3rem;
  background: hsl(237, 100%, 5%);
  color: white;
  > div {
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    letter-spacing: 0.05em;
    @media (max-width: 450px) {
      flex-direction: column;
    }
  }
`
const Logo = styled.span`
  font-size: 1.2rem;
  cursor: pointer;
  white-space: nowrap;
  @media (max-width: 450px) {
    margin-top: 0.5rem;
  }
  ${ typewriter }
`

const FEC = styled.a`
  display: flex;
  align-items: center;
  font-weight: 100;
  font-family: Avenir Next, Segue UI;
  color: inherit;
  text-decoration: none;
  span {
    text-transform: uppercase;
    &:first-child {
      font-size: 0.8rem;
    }
  }
  img {
    width: 8rem;
    padding-bottom: 3px;
  }
`

const Credits = styled.footer`
  max-width: 720px;
  margin: 0 auto;
  border-top: 1px solid #ccc;
  text-align: center;
  padding: 2rem 0.5rem;
  line-height: 1.5;
`

const Home = styled.main`
  position: relative;
  z-index: 0;
  height: calc(100vh - 8.5rem);
  min-height: 400px;
  max-height: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  ${ Desc } {
    margin-top: 1.5rem;
  }
  
  &::before {
    content: '';
    display: block;
    background: url(${require('./images/coffee-stain.png')}) no-repeat 50% 50% / cover;
    width: 40vh;
    height: 40vh;
    position: absolute;
    z-index: 0;
    top: 30vh;
    left: calc(50vw - 40vh);
    pointer-events: none;
  }
`

const Images = styled.div`
  height: calc(50vh);
  min-height: 15rem;
  position: relative;
  width: 100%;
  max-width: 720px;
  pointer-events: none;
`

const Polaroid = styled.div`
  padding: 0.5rem;
  background: white;
  position: absolute;
  left: 50%;
  top: 0;
  transform-origin: 0% 100%;
  &:nth-child(1) {
    transform: translateY(5%) rotate(-1deg) translateX(-90%);
  }
  &:nth-child(2) {
    transform: translateX(10%) rotate(10deg) translateX(-20%);
  }
  font-size: 0.9rem;  
  font-weight: 100;
  color: #666;
  z-index: ${ props => props.z };
  box-shadow: 0 0 4px rgba(0,0,0,0.1);
  &::before {
    content: '';
    display: block;
    background: url(${props => props.src}) no-repeat 50% 50% / cover;
    width: 30vh;
    height: 30vh;
    min-width: 8rem;
    min-height: 8rem;
    margin-bottom: 0.5rem;
    box-shadow: inset 0 0 4px rgba(0,0,0,0.1);
  }
  &::after {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.6rem;
    content: 'z-index: ${props => props.z}';
    text-transform: uppercase;
    color: #D0011B;
  }
`

const Frame = styled.div`
  width: 100vw;
  overflow: hidden;
`

export default observer(() => {
  const num = store.url.demo
  const demo = num && demos[num - 1]
  return (
    <Frame>
      <Header>
        <div>
          <Logo onClick={() => navigate({ demo: null })}>z-index.exposed</Logo>
          <FEC href="https://frontend.center" target="_blank">
            <span>by</span> <img src={require('./images/logo.png')} alt="Front End"/>
            <span>center</span>
          </FEC>
        </div>
      </Header>
      { demo ?
        <Main>
          <Nav>
            <Link to={{ demo: num > 1 ? num - 1 : null }}>{
              num > 1 ? 'Previous' : 'Back'
            }</Link>
            <Title>Ex. { String.fromCharCode(64 + num) }—{demo.title}</Title>
            { num < demos.length && <Link to={{ demo: num + 1 }}>Next</Link> }
          </Nav>
          <Desc dangerouslySetInnerHTML={{ __html: md.render(demo.description.trim().replace(/^ {6}/gm, '')) }}/>
          <Demo code={demo.code} num={num}/>
        </Main>
        :
        <Home>
          <Images>
            <Polaroid src={require('./images/polaroid1.jpg')} z="99999999">
              UF—OMG
            </Polaroid>
            <Polaroid src={require('./images/polaroid2.jpg')} z="0">
              TRUTH
            </Polaroid>
          </Images>
          <Title>Secrets of the Z-Dimension Revealed!</Title>
          <Desc>
            <p></p>
          </Desc>
          <Link to={{ demo: 1 }}>Start</Link>
        </Home>
      }
      <Credits>
        Built with ♥️
        by <A href="https://twitter.com/glenmaddern" target="_blank">
        @glenmaddern
      </A> for <A href="https://frontend.center" target="_blank">
        frontend.center
      </A>. View on <A href="https://github.com/frontendcenter/z-index.exposed" target="_blank">
        GitHub
      </A>.
      </Credits>
    </Frame>
  )
})
