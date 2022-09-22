import styled from 'styled-components'

export { default as FormGroup } from './FormGroup'

const CardContainer = styled.div`
  height: 50vh;
  padding: 8px;
`

const CardInner = styled.div`
  height: 100%;
  padding: 8px;
`

export function HalfHeightCard({ children }) {
  return <CardContainer>
    <CardInner>{ children }</CardInner>
  </CardContainer>
}

export const FullWidthButton = styled.button`
  font-size: 20px;
  width: 100%;
  height: 40px;
`

export const Textarea = styled.textarea`
  width: 100%;
  height: 300px;
  font-size: 24px;
  font-family: Arial;
`

export const BigText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  text-align: center;
`
