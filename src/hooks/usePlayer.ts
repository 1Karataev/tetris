import React from "react";
import { STAGE_WIDTH } from "../setup";
import { isColliding, randomTetromino } from "../gameHelpers";
import { STAGE } from "./useStage";

export type PLAYER ={
  pos:{
    x: number,
    y:number,
  },
  tetromino:(string|number)[][],
  collided:boolean
}

export const usePlayer = ()=>{
const [player, setPlayer] = React.useState({} as PLAYER)

const rotate = (matrix:PLAYER['tetromino']) =>{
  const mtrx =matrix.map((_, index) =>matrix.map(col => col[index]))
  return mtrx.map(row=>row.reverse())
}

const playerRotate = (stage: STAGE):void =>{
const playerClone = JSON.parse(JSON.stringify(player))
playerClone.tetromino = rotate(playerClone.tetromino)

const posX = playerClone.pos.x
let offset = 1
while(isColliding(playerClone, stage, {x:0, y:0})){
  playerClone.pos.x +=offset
  offset = -(offset + (offset>0?1:-1))
  if(offset > playerClone.tetromino[0].length){
    playerClone.pos.x = posX
    return
  }
}

setPlayer(playerClone)
} 

const updatePlayerPos = ({x, y, collided}: {x: number, y: number, collided: boolean}):void=>{
  setPlayer(prev =>({
    ...prev, 
    pos: {x:(prev.pos.x+=x), y:(prev.pos.y+=y)}
  }))
}
const resetPlayer = React.useCallback(():void=> setPlayer({
  pos:{x:STAGE_WIDTH/2-2, y:0},
  tetromino:randomTetromino().shape,
  collided:false
}),[])
return {player,updatePlayerPos, resetPlayer,playerRotate}
}
