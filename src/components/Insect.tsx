import { useEffect, useRef, useState } from 'react';
import { useTick } from '@pixi/react';
import type { Point } from '../types';
import { Particles } from './Particles';

import { Helpers as H } from '../helpers/utils';
import sfx from '../helpers/sfx';
import { useGameStore } from '../store';

const RADIUS = 10;
const RESET_DELAY = 1000;

export function Insect({ textures, players, gameOver }) {
  const { SIZE } = useGameStore();

  const [caught, setCaught] = useState(false);
  const [respawnTime, setRespawnTime] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);


const [pos, setPos] = useState<Point>(getSpawnFromTop(SIZE));
const [velocity, setVelocity] = useState<Point>({
  x: H.rnd(-0.5, 0.5),
  y: H.rnd(1.0, 2.0), // ensure downward
});
const [speed] = useState(() => H.rnd(0.8, 1.6));
const angle = useRef(Math.random() * Math.PI * 2);

    // Get dynamic floor: lowest player Y - 20px
    const floorY = SIZE.h - 150;

  useTick((tick) => {
    if (gameOver) return;
    // should use tick.deltaTime
    const now = performance.now();

    if (caught) {
      const p = players[caught];
      setPos({ ...p.pos });

      if (p.direction === 0) {
        if (!respawnTime) {
          setRespawnTime(now);
          setShowParticles(true);
        } else if (now - respawnTime > RESET_DELAY) {
          setCaught(false);
          setRespawnTime(null);
          setShowParticles(false);
          setPos(getSpawnFromTop(SIZE));
        }
      }
      return;
    }

 angle.current += 0.1 * speed;

  // Calculate buzz motion
  const buzzX = Math.cos(angle.current) * 0.5;
  const buzzY = Math.sin(angle.current * 1.5) * 0.5;

  // Determine player floor: 20px above lowest player

  setPos(prev => {
    let nextX = prev.x + (velocity.x + buzzX) * speed;
    let nextY = prev.y + (velocity.y + buzzY) * speed;

    // Bounce left/right
    if (nextX < 20 || nextX > SIZE.w - 20) {
      setVelocity(v => ({ ...v, x: -v.x }));
      nextX = Math.max(20, Math.min(SIZE.w - 20, nextX));
    }

    // Bounce off floor (above player)
    if (nextY >= floorY) {
      setVelocity(v => ({ ...v, y: -Math.abs(v.y) }));
      nextY = floorY;
    }

    // Bounce off top
    if (nextY < 0) {
      setVelocity(v => ({ ...v, y: Math.abs(v.y) }));
      nextY = 0;
    }

    return { x: nextX, y: nextY };
  });

  // Collision detection
  for (const key in players) {
    const player = players[key];
    const dist = Math.hypot(player.pos.x - pos.x, player.pos.y - pos.y);
    if (dist <= RADIUS + 6) {
      setCaught(key);
      player.setCombo([...player.combo, 'fly']);
      sfx('buzz');
    }
  }

  });

  return (
    <>
      {!showParticles && (
        <>
          <pixiSprite
            angle={caught ? 180 : 0}
            anchor={0.5}
            texture={textures[(Math.sin(performance.now() * 0.01)) > 0 ? 1 : 0]}
            x={pos.x}
            y={pos.y}
          />
          {!caught && <pixiGraphics
            x={pos.x - 3}
            y={pos.y}
            draw={(g) => {
              g.clear().circle(0, 0, 3).fill('yellow');
            }}
          />}
          {!caught && <pixiGraphics
            x={pos.x + 3}
            y={pos.y}
            draw={(g) => {
              g.clear().circle(0, 0, 3).fill('yellow');
            }}
          />}
        </>
      )}
      <Particles trigger={showParticles} at={pos} />
    </>
  );
}

function getSpawnFromTop(SIZE): Point {
  return { x: H.rnd(50, SIZE.w - 50), y: 0};
}
