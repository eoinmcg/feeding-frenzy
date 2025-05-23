import { useState, useEffect, useCallback } from 'react';
import { useTick } from '@pixi/react';
import type { Point } from '../types';
import { useGameStore } from '../store';
import sfx from '../helpers/sfx';

import { Helpers as H } from '../helpers/utils';

export function Powerup({ texture, player1, player2, gameOver }) {
  const { SIZE, DISGUISES } = useGameStore();
  
  const SPEED = 1;
  const RADIUS = 10;

  const [players,setPlayers] = useState([]);
  useEffect(() => {
    const tmpPlayers = [];
    tmpPlayers.push(player1);
    if (player2) {
      tmpPlayers.push(player2);
    }
    setPlayers(tmpPlayers);
  }, [player1, player2]);

  const [state, setState] = useState(() => ({
    isMoving: false,
    caught: false,
    // waitTime: getRandomWaitTime(),
    waitTime: 0,
    pos: { x: -50, y: SIZE.h / 2 }, // Start off-screen
    direction: 1, // 1 for left->right, -1 for right->left
    startX: -50,
    endX: SIZE.w + 50
  }));

  const reset = useCallback(() => {
    const fromLeft = Math.random() < 0.5;
    setState({
      isMoving: false,
      waitTime: getRandomWaitTime(),
      pos: { 
        x: fromLeft ? -50 : SIZE.w + 50, 
        y: SIZE.h / 2 
      },
      direction: fromLeft ? 1 : -1,
      startX: fromLeft ? -50 : SIZE.w + 50,
      endX: fromLeft ? SIZE.w + 50 : -50
    });
  }, [SIZE.w, SIZE.h]);

  useTick((tick) => {
    if (gameOver) return;
    const deltaTime = tick.deltaTime;

    let caught = false;
    if (!state.caught) {
      for (const [key, player] of Object.entries(players)) {
        if (H.checkCollision(player, state.pos, RADIUS)) {
          caught = key;
          player.setCombo([...player.combo, 'powerup']);
          setState(prevState => {
              return { ...prevState, caught: key };
          });
        }
      }
    }

    if (state.caught) {
        const p = players[state.caught];

        if (p.direction === 0) {
          p.setDisguise(H.rndArray(DISGUISES));
          return reset();
        }

        setState(prevState => {
            return { ...prevState, pos: p.pos };
        });
      return;
    }

    setState(prevState => {
      if (!prevState.isMoving) {
        // Waiting phase - countdown to next movement
        const newWaitTime = prevState.waitTime - deltaTime;
        
        if (newWaitTime <= 0) {
          // Start moving
          return {
            ...prevState,
            isMoving: true,
            waitTime: 0
          };
        }
        
        return {
          ...prevState,
          waitTime: newWaitTime
        };
      } else {
        // Moving phase
        const newX = prevState.pos.x + (SPEED * prevState.direction * deltaTime);
        
        // Check if reached the other side
        const reachedEnd = prevState.direction === 1 
          ? newX >= prevState.endX 
          : newX <= prevState.endX;
        
        if (reachedEnd) {
          // Reset for next cycle
          setTimeout(reset, 0);
          return prevState;
        }
        
        return {
          ...prevState,
          pos: {
            ...prevState.pos,
            x: newX
          },
          caught: caught
        };
      }
    });
  });

  if (!state.isMoving) {
    return null;
  }

  return (
    <pixiSprite
      anchor={0.5}
      texture={texture}
      x={state.pos.x}
      y={state.pos.y}
      scale={0.8 + Math.sin(Date.now() * 0.005) * 0.1} // Gentle pulsing
    />
  );
}

function getRandomWaitTime() {
  // Random wait time between 3-15 seconds (at 60fps)
  return (Math.random() * 7 + 3) * 60;
}

function getNextActive() {
  return Math.random() * 10;
}
