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
  margin-bottom: ${buttonHeight}px;
  height: calc(100vh - ${buttonHeight}px);
  overflow: scroll;
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
export { Body, Bottom, Main, Buttons, Button }