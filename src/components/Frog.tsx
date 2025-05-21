import { useEffect,  useState } from 'react';
import { useTick } from '@pixi/react';
import type { Point } from '../types';
import useInput from '../hooks/useInput';

import sfx from '../helpers/sfx';
import { Helpers as H } from '../helpers/utils';
import { useGameStore } from '../store';
import { Combo } from './Combo';


export function Frog({ textures, player, pos, setPos, direction, setDirection, targetPos, setTargetPos, combo, setCombo, score, setScore, gameOver, color }) {

  const { R, SPEED, SIZE } = useGameStore();
  const originalPos: Point = player.pos;
  const { mousePosition, mouseClick, touchPosition } = useInput();

  const [eyesClosed, setEyesClosed] = useState(0);
  const [mouth, setMouth] = useState(3);
  const [comboText, setComboText] = useState(0);

  color = color || 'goldenrod';

  useEffect(() => {
    if (mouseClick && mouseClick.x <= SIZE.w) {
      if (targetPos !== null || mouseClick.y > 450) return;
      sfx('swipe');
      const p = { x: mouseClick.x + R, y: mouseClick.y };
      setTargetPos(p);
      setDirection(1);
      setEyesClosed(0);
    }
    if (touchPosition) {
      const p = { x: touchPosition.x + R, y: touchPosition.y };
      setTargetPos(p);
      setDirection(1);
      setEyesClosed(0);
    }
  }, [mouseClick, touchPosition]);

  useTick((tick) => {

    if (gameOver) return;

    if (eyesClosed && performance.now() - eyesClosed > 500) {
      setEyesClosed(0);
    }

    if (!targetPos || direction === 0) return;

    const dest = direction === 1 ? targetPos : originalPos;

    const dx = dest.x - pos.x;
    const dy = dest.y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speedFactor = direction === 1 ? 1.2 : 0.8; // 20% faster out, 20% slower back
    const step = SPEED * speedFactor * (tick.deltaTime / 40);

    if (distance <= step) {
      if (direction === 1) {
        setDirection(-1); // reverse to return
      } else {
        if (combo.length) {
          sfx('collect');
          setEyesClosed(window.performance.now());
          setMouth(2);
        } else {
          setMouth(3);
        }
        setScore(parseInt(score, 10) + (10 * combo.length));
        if (combo.length > 1) {
          setComboText(combo.length);
        }
        setCombo([]);
        setDirection(0);
        setTargetPos(null);
      }
      setPos(dest); // snap exactly to target
    } else {
      const angle = Math.atan2(dy, dx);
      setPos({
        x: pos.x + Math.cos(angle) * step,
        y: pos.y + Math.sin(angle) * step,
      });
    }
  });

  return (
    <>
      <pixiSprite
          tint={color}
          anchor={0.5}
          texture={textures[0]}
          x={originalPos.x}
          y={originalPos.y} />
      <pixiSprite
          alpha={0.75}
          anchor={0.5}
          texture={textures[1]}
          x={originalPos.x}
          y={originalPos.y} />
      {/* mouth */}
      <pixiSprite
          anchor={0.5}
          texture={textures[mouth]}
          x={originalPos.x}
          y={originalPos.y} />
      {/* eyes */}
      <pixiGraphics
        draw={(g) => {
          const eyeY = originalPos.y - 15;
          const a = targetPos ? Math.atan2(targetPos.y - originalPos.y, targetPos.x - originalPos.x) : 0;
          const xPos = [originalPos.x - 8, originalPos.x + 8];
          let diff = 0;
          if (targetPos) {
            diff = (targetPos.x - originalPos.x) / 2;
            if (diff < -3) diff = -3; 
            if (diff > 3) diff = 3;
          }

          g.clear();

          xPos.forEach((x) => {
            g.circle(x, eyeY, 9).fill('black'); //outline
            if (eyesClosed) {
              g.circle(x, eyeY, 7).fill(color); // white
            } else {
              g.circle(x, eyeY, 7).fill('white'); // white
              g.circle(x + diff, eyeY - (diff ? 3 : 0), 3).fill('black'); // pupil
            }
          });
        }}
      />
      {targetPos !== null && <pixiGraphics
        draw={(g) => {
          g.clear();
          let w = 5;
          while (w--) {

            g.moveTo(originalPos.x + w, originalPos.y)
              .lineTo(pos.x + w, pos.y)
              .stroke({ color: w < 2 ? 'hotpink' : 0xff0000, pixelLine: true });
          }
        }}
      />}

      {/* tongue tip */}
      {targetPos !== null && <pixiGraphics
        x={pos.x}
        y={pos.y}
        draw={(g) => {
          g.clear()
            .circle(0, 0, 10)
            .fill(0xcc2200);
        }}
      />}
      <Combo defaultColor={color} text={comboText} pos={originalPos} reset={setComboText} />
    </>
  );
}
