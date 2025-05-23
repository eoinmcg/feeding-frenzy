import { useState, useEffect } from 'react';
import { useTick } from '@pixi/react';

import { Bg } from '../components/Bg';
import { Timer } from '../components/Timer';
import { BigMessage } from '../components/BigMessage';
import { Score } from '../components/Score';
import { Frog } from '../components/Frog';
import { Powerup } from '../components/Powerup';
import { InsectManager } from '../components/InsectManager'; // Import the insect
import { useGameStore } from '../store';

import type { Point } from '../types';
import sfx from '../helpers/sfx';
import { Helpers as H } from '../helpers/utils';

export default function Play2Local({textures, setScene, mute, plays}) {

  const [timer, setTimer] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [music] = useState(new Audio());

  const { P1, P2, SIZE } = useGameStore();

  const [pos1, setPos1] = useState<Point>(P1.pos);
  const [direction1, setDirection1] = useState<1 | -1 | 0>(0); // lifted
  const [targetPos1, setTargetPos1] = useState<Point | null>(null);
  const [combo1, setCombo1] = useState([]);
  const [score1, setScore1] = useState([0]);
  const [p1Col, setP1Col] = useState(H.rndArray(P1.colors));
  const [disguise1, setDisguise1] = useState();

  const [pos2, setPos2] = useState<Point>(P1.pos);
  const [direction2, setDirection2] = useState<1 | -1 | 0>(0); // lifted
  const [targetPos2, setTargetPos2] = useState<Point | null>(null);
  const [combo2, setCombo2] = useState([]);
  const [score2, setScore2] = useState([0]);
  const [p2Col, setP2Col] = useState(H.rndArray(P2.colors));
  const [disguise2, setDisguise2] = useState();

  // handle muting sfx & music
  useEffect(() => {
    if (mute) return;
    music.src = 'cheezy.mp3';
    music.volume = .2;
    music.play();
    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, [plays, mute]);

  useTick((tick) => {
    if (timer < 0 && !gameOver) {
      setGameOver(true);
      music.pause();
      music.currentTime = 0;
      sfx('bell');
    } else if (timer >= 0) {
      setTimer(timer - (tick.deltaTime / 80))
    }
  });

  return (
    <>
      <Bg textures={textures} />

      <pixiGraphics
        alpha={.25}
        draw={(g) => {
          g.clear().rect(0, SIZE.h/2-4, SIZE.w, 8).fill('white');
        }}
      />

      <Frog
        textures={textures}
        player={P1}
        pos={pos1}
        setPos={setPos1}
        direction={direction1}
        setDirection={setDirection1}
        targetPos={targetPos1}
        setTargetPos={setTargetPos1}
        combo={combo1}
        setCombo={setCombo1}
        score={score1}
        setScore={setScore1}
        gameOver={gameOver}
        color={p1Col}
        disguise={disguise1}
        setDiguise={setDisguise1}
        mode={'Play2Local'}
      />
      <Score player={P1} score={score1} />

      <Frog
        textures={textures}
        player={P2}
        pos={pos2}
        setPos={setPos2}
        direction={direction2}
        setDirection={setDirection2}
        targetPos={targetPos2}
        setTargetPos={setTargetPos2}
        combo={combo2}
        setCombo={setCombo2}
        score={score2}
        setScore={setScore2}
        gameOver={gameOver}
        color={p2Col}
        disguise={disguise2}
        setDiguise={setDisguise2}
        mode={'Play2Local'}
      />
      <Score player={P2} score={score2} />

      <InsectManager
        textures={[textures['fly.png'], textures['fly_2.png']]}
        player1={{pos: pos1,direction: direction1, originalPos:P1.pos, combo: combo1, setCombo: setCombo1, disguise: disguise1, name: "p1"}}
        player2={{pos: pos2,direction: direction2, originalPos:P2.pos, combo: combo2, setCombo: setCombo2, disguise: disguise2, name: "p2"}}
        gameOver={gameOver}
      />
      <Powerup texture={textures['powerup.png']} 
        player1={{pos: pos1,direction: direction1, originalPos:P1.pos, combo: combo1, setCombo: setCombo1, setDisguise: setDisguise1}}
        player2={{pos: pos2,direction: direction2, originalPos:P2.pos, combo: combo2, setCombo: setCombo2, setDisguise: setDisguise2}}
        gameOver={gameOver}
      />

      {gameOver && <BigMessage text={'TIME\n UP!'} />}
    </>
  );
}

