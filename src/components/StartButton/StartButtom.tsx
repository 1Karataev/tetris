import React from 'react'
import {StyledStartButton} from './StartButton.styles'

type Props = {
  callback:()=> void
};

const  StartButtom:React.FC<Props>= ({callback}) => (
  <StyledStartButton onClick ={callback} >Старт</StyledStartButton>
)

export default StartButtom