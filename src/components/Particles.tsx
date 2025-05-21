import { useEffect, useRef, useState } from 'react';
import { useTick } from '@pixi/react';
import { Graphics as PixiGraphics } from 'pixi.js';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
};

type Props = {
  trigger: boolean;
  at: { x: number; y: number };
};

export function Particles({ trigger, at }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (trigger && !triggeredRef.current) {
      triggeredRef.current = true;
      const newParticles: Particle[] = Array.from({ length: 15 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        return {
          x: at.x,
          y: at.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
        };
      });
      setParticles(newParticles);
    }
    if (!trigger) {
      triggeredRef.current = false;
    }
  }, [trigger, at]);

  useTick(() => {
    if (particles.length === 0) return;

    setParticles((prev) =>
      prev
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          alpha: p.alpha - 0.03,
        }))
        .filter((p) => p.alpha > 0)
    );
  });

  return (
    <>
      {particles.map((p, i) => (
        <pixiGraphics
          key={i}
          x={p.x}
          y={p.y}
          alpha={p.alpha}
          draw={(g) => {
            g.clear().circle(0, 0, 2).fill(0xff0000);
          }}
        />
      ))}
    </>
  );
}

