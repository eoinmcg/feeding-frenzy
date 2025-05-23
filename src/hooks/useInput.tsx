import { useEffect, useState } from 'react';
import type { Point, UseInputReturn } from '../types';

export default function useInput(multiTouchMode = false): UseInputReturn {
  const [mouseClick, setMouseClick] = useState<Point | null>(null);
  const [touchPosition, setTouchPosition] = useState<Point | null>(null);
  const [p1Touch, setP1Touch] = useState<Point | null>(null);
  const [p2Touch, setP2Touch] = useState<Point | null>(null);
  
  const canvas = document.querySelector('#root canvas');
  
  const normalize = (point: Point): Point => {
    const boundingBox = canvas?.getBoundingClientRect();
    if (!boundingBox || !canvas) return point;
    
    return {
      x: (point.x - boundingBox.left) * (canvas.width / boundingBox.width),
      y: (point.y - boundingBox.top) * (canvas.height / boundingBox.height)
    };
  };

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      setMouseClick(normalize({ x: e.clientX, y: e.clientY }));
    };

    const handleTouchEnd = (e: TouchEvent) => {

      if (multiTouchMode && e.changedTouches.length > 0) {
        const canvasHeight = canvas.height;
        const midPoint = canvasHeight / 2;

        let newP1Touch = null;
        let newP2Touch = null;

        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          const normalizedPoint = normalize({ x: touch.clientX, y: touch.clientY });

          if (normalizedPoint.y < midPoint - 3) {
            newP2Touch = normalizedPoint;
          } else if (normalizedPoint.y > midPoint + 3) {
            newP1Touch = normalizedPoint;
          }
        }
        // Update the states
        setP1Touch(newP1Touch);
        setP2Touch(newP2Touch);
      } else if (e.touches.length > 0) {
        const touch = e.touches[0];
        setTouchPosition(normalize({ x: touch.clientX, y: touch.clientY }));
      }

    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return {
    mouseClick,
    touchPosition,
    p1Touch,
    p2Touch,
  };
}
