import { useState, useRef, useEffect } from 'react';
import { Insect } from './Insect';

import { v4 as uuidv4 } from 'uuid'; // For unique insect IDs

export function InsectManager({textures, player1, player2, gameOver}) {

  const [players,setPlayers] = useState([]);
  useEffect(() => {
    const tmpPlayers = [];
    tmpPlayers.push(player1);
    if (player2) {
      tmpPlayers.push(player2);
    }
    setPlayers(tmpPlayers);
  }, [player1, player2]);

  const numInsects = 10;
  const insects = useRef(Array(numInsects).fill().map((n, i) => ({
    id: i
  })));

  return (
    <>
      {insects.current.map((n) => {
        return (
          <Insect
            key={n.id}
            textures={textures}
            players={players}
            gameOver={gameOver}
          />
        );
      })}
    </>
  );
}
