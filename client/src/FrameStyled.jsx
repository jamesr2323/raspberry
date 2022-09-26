import styled from 'styled-components'

const buttonHeight = 80
const Body = styled.div`
  font-size: 20px;
`

const Bottom = styled.div`
  position: fixed;
  bottom: 0px;
  height: ${buttonHeight}px;
  width: 100vw;
  background: #ffd0d0;
`

const Main = styled.div`
  height: 100vh;
  overflow: hidden;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1 1 0px;
  flex-grow: 1;
  height: 100%;
`

const Button = styled.div`
  padding: 4px;
  height: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
`

const Video = styled.video`
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
`

export { Body, Bottom, Main, Buttons, Button, Video }