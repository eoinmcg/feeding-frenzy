import { useRef, useState, useEffect } from 'react';
import { useTick } from '@pixi/react';
import type { Point } from '../types';
import { Particles } from './Particles';

import { Helpers as H } from '../helpers/utils'; // Assuming checkCollision is now here
import sfx from '../helpers/sfx';
import { useGameStore } from '../store';

const RADIUS = 10;
const RESET_DELAY = 1000;
const DISGUISE_EFFECT_STRENGTH = 0.5;

export function Insect({ textures, players, gameOver }) {
  const { SIZE } = useGameStore();

  const [caught, setCaught] = useState(false);
  const [respawnTime, setRespawnTime] = useState<number | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  // Modified spawn function
  const [pos, setPos] = useState<Point>(getSpawnPosition(SIZE));
  const [velocity, setVelocity] = useState<Point>({
    x: H.rnd(-0.5, 0.5),
    y: H.rnd(0.5, 1.0), // Adjust initial vertical velocity if needed
  });
  const [speed] = useState(() => H.rnd(0.8, 1.6));
  const angle = useRef(Math.random() * Math.PI * 2);

  const floorY = SIZE.h - 150;

  useTick((tick) => {
    if (gameOver) return;
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
          setPos(getSpawnPosition(SIZE)); // Use new spawn function
          // Reset velocity on respawn
          setVelocity({
            x: H.rnd(-0.5, 0.5),
            y: H.rnd(0.5, 1.0),
          });
        }
      }
      return;
    }

    angle.current += 0.1 * speed;

    // Calculate buzz motion
    const buzzX = Math.cos(angle.current) * 0.5;
    const buzzY = Math.sin(angle.current * 1.5) * 0.5;

    // --- Attraction/Repulsion Logic ---
    let attractionForceX = 0;
    let attractionForceY = 0;

let nearestPlayer = null;
let minDistSq = Infinity;
let distance = 0;

for (const player of players) {
  const dx = player.originalPos.x - pos.x;
  const dy = player.originalPos.y - pos.y;
  const distSq = dx * dx + dy * dy;

  if (distSq < minDistSq) {
    minDistSq = distSq;
    nearestPlayer = player;
    distance = Math.sqrt(distSq);
  }
}


    if (nearestPlayer) {
      const dx = nearestPlayer.pos.x - pos.x;
      const dy = nearestPlayer.pos.y - pos.y;

      // Normalize direction vector
      const dirX = dx / distance;
      const dirY = dy / distance;

      const effectMagnitude = DISGUISE_EFFECT_STRENGTH * (tick.deltaTime / 40); // Scale with delta time

      // 'poop' or 'flower' disguises attract
      if (nearestPlayer.disguise === 'poop' || nearestPlayer.disguise === 'flower') {
        attractionForceX = dirX * effectMagnitude;
        attractionForceY = dirY * effectMagnitude;
      }
      // 'hat' or 'onion' disguises repel
      else if (nearestPlayer.disguise === 'hat' || nearestPlayer.disguise === 'onion') {
        attractionForceX = -dirX * effectMagnitude;
        attractionForceY = -dirY * effectMagnitude;
      }
    }

    setPos(prev => {
      let nextX = prev.x + (velocity.x + buzzX + attractionForceX) * speed;
      let nextY = prev.y + (velocity.y + buzzY + attractionForceY) * speed;

      // Update velocity with attraction/repulsion
      setVelocity(v => ({
        x: v.x + attractionForceX,
        y: v.y + attractionForceY,
      }));

      // Normalize velocity to maintain general speed
      const currentVelocityMagnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      if (currentVelocityMagnitude > 0.1) { // Avoid division by zero
        const normalizer = 1.0 / currentVelocityMagnitude; // Adjust this if you want velocity to change significantly
        setVelocity(v => ({ x: v.x * normalizer, y: v.y * normalizer }));
      }


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

    for (const [key, player] of Object.entries(players)) {
      if (player.direction !== 0 && H.checkCollision(player, pos, RADIUS)) {
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

function getSpawnPosition(SIZE): Point {
  const spawnSide = H.rnd(0, 1) > 0.5 ? 'left' : 'right'; // Randomly choose left or right
  const x = spawnSide === 'left' ? H.rnd(-20, SIZE.w * 0.2) : H.rnd(SIZE.w * 0.8, SIZE.w + 20);
  const y = H.rnd(SIZE.h * 0.3, SIZE.h * 0.7); // Middle third of the screen height
  return { x, y };
}
