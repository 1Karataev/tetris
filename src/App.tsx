import React from 'react';
import './App.css';
import Stage from './components/Stage/Stage';
import Display from './components/Display/Display';
import StartButtom from './components/StartButton/StartButtom';
import { StyledTetris, StyledTetrisWrapper } from './App.styles';
import { useState } from 'react';
import { createStage, isColliding } from './gameHelpers';
import { useInterval } from './hooks/useInterval';
import { useStage } from './hooks/useStage';
import { usePlayer } from './hooks/usePlayer';
import { useRef } from 'react';


const App :React.FC = ()=> {
  const [dropTime,setDropTime] = useState<null|number>(null)
  const [gameOver,setgameOver] = useState(true)
  const {player, updatePlayerPos,resetPlayer,playerRotate} = usePlayer()
  const {stage, setStage} = useStage(player, resetPlayer)
  const gameArea = useRef<HTMLDivElement>(null)

  const movePlayer = (dr:number)=>{
    if(!isColliding(player, stage, {x:dr, y:0})){
      updatePlayerPos({ x: dr, y: 0, collided: false });
    }
    
  }
  const keyUp = ({keyCode}:{keyCode: number}): void=>{
    if (keyCode === 40) {
      setDropTime(1000);
    }
  }
  const handleStartGame = ():void =>{
    if(gameArea.current) gameArea.current.focus();
    setStage( createStage())
    setDropTime(1000)
    resetPlayer()
    setgameOver(false)
  }

  const move = ({keyCode, repeat}:{keyCode: number, repeat: boolean}):void =>{
    if (keyCode === 37) {
      movePlayer(-1);
    } else if (keyCode === 39) {
      movePlayer(1);
    } else if (keyCode === 40) {
      if (repeat) return;
      setDropTime(30);
    } else if (keyCode === 38) {
      playerRotate(stage)
    }
  }
  const drop = () :void=>{
    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    }else {
      if(player.pos.y < 1){
        setgameOver(true)
        setDropTime(null)
      }
      updatePlayerPos({x:0, y:0, collided:true})
    }
    
  }
useInterval(()=>{
  drop()
}, dropTime)

  return (
    <StyledTetrisWrapper role="button" tabIndex={0} onKeyDown={move} onKeyUp={keyUp} ref={gameArea}>
      <StyledTetris>
        <div className="display">
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text="Игра окончена" />
              <StartButtom callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`Очки:`} />
              <Display text={`Столбец:`} />
              <Display text={`Уровень:`} />
            </>
          )}
        </div>
        <Stage stage = {stage}/>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}

export default App;
