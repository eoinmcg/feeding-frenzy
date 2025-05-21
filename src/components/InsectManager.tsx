import { useRef, useEffect } from 'react';
import { Insect } from './Insect';

export function InsectManager({textures, player1, player2, gameOver}) {

  const numInsects = 10;
  const insects = useRef(Array(numInsects).fill().map((n, i) => ({
    id: i
  })));


  return (
    <>
      {insects.current.map((n, i) => {
        return (
          <Insect
            key={i}
            textures={textures}
            players={[player1, player2]}
            player1={player1}
            gameOver={gameOver}
          />
        );
      })}
    </>
  );
}
