import { useEffect,  useState } from 'react';
import { useTick } from '@pixi/react';
import type { Point } from '../types';
import useInput from '../hooks/useInput';

import sfx from '../helpers/sfx';
import { useGameStore } from '../store';
import { Combo } from './Combo';


export function Frog({ textures, player, pos, setPos, direction, setDirection, targetPos, setTargetPos, combo, setCombo, score, setScore, gameOver, color, disguise, setDiguise, mode }) {

  const { R, SPEED, SIZE } = useGameStore();
  const originalPos: Point = player.pos;
  const { mouseClick, touchPosition, p1Touch, p2Touch } = useInput(mode === 'Play2Local' ? true : false);

  const [eyesClosed, setEyesClosed] = useState(0);
  const [mouth, setMouth] = useState('mouth_smile.png');
  const [comboText, setComboText] = useState(0);


  useEffect(() => {
    setPos(originalPos);
  }, []);

  color = color || 'goldenrod';

  // amplify allows 2 player touch to extend beyond the frog's
  // half off the screen
  const handleInput = (pos, amplify = 0) => {
    sfx('swipe');
    const finalPos = amplify > 0 
      ? amplifyTargetPos(originalPos, pos, amplify) 
      : pos;
    setTargetPos(finalPos);
    setDirection(1);
    setEyesClosed(0);
  }

  useEffect(() => {
    if (direction !== 0) return;
    if (p1Touch && mode == 'Play2Local' && player.name === 'p1') {
      return handleInput({ x: p1Touch.x + R, y: p1Touch.y }, 150);
    }
    if (p2Touch && mode == 'Play2Local' && player.name === 'p2') {
      return handleInput({ x: p2Touch.x + R, y: p2Touch.y }, 150);
    }

    if (mode === 'Play2Local') return;

    if (mouseClick && mouseClick.x <= SIZE.w) {
      if (targetPos !== null || mouseClick.y > 450) return;
      return handleInput({ x: mouseClick.x + R, y: mouseClick.y });
    }
    if (touchPosition && !mode) {
      return handleInput({ x: touchPosition.x + R, y: touchPosition.y });
    }
  }, [mouseClick, touchPosition, p1Touch, p2Touch]);

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
          setMouth('mouth_smile.png');
        } else {
          setMouth('mouth_sad.png');
        }
        setScore(parseInt(score, 10) + (10 * combo.length));
        if (combo.length > 1) {
          setComboText(combo.length + 1);
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
      <pixiContainer>
      {disguise === 'poop' && <pixiSprite
          anchor={0.5}
          texture={textures['poop.png']}
          x={originalPos.x}
          y={originalPos.y - 32} />
      }
      {disguise === 'flower' && <pixiSprite
          anchor={0.5}
          texture={textures['flower.png']}
          x={originalPos.x}
          y={originalPos.y - 32} />
      }
      <pixiSprite
          tint={color}
          anchor={0.5}
          texture={textures['frog_bw.png']}
          x={originalPos.x}
          y={originalPos.y} />
      <pixiSprite
          alpha={0.75}
          anchor={0.5}
          texture={textures['frog_belly.png']}
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
              .stroke({ 
                color: w < 2 ? 'hotpink' : 0xff0000, 
                width: w < 2 ? 2 : 1, // Different widths for different parts
                pixelLine: true 
              });
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
      </pixiContainer>
    </>
  );
}

const amplifyTargetPos = (originalPos, targetPos, amplificationPixels) => {
  // Calculate the direction vector
  const dx = targetPos.x - originalPos.x;
  const dy = targetPos.y - originalPos.y;
  
  // Calculate the current distance
  const currentDistance = Math.sqrt(dx * dx + dy * dy);
  
  // Avoid division by zero
  if (currentDistance === 0) return targetPos;
  
  // Calculate the unit vector (normalized direction)
  const unitX = dx / currentDistance;
  const unitY = dy / currentDistance;
  
  // Calculate the new distance
  const newDistance = currentDistance + amplificationPixels;
  
  // Return the amplified position
  return {
    x: originalPos.x + (unitX * newDistance),
    y: originalPos.y + (unitY * newDistance)
  };
};
