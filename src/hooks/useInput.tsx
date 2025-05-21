import { useEffect, useState } from 'react';

import type { Point, UseInputReturn } from '../types';

export default function useInput(): UseInputReturn {
  const [mousePosition, setMousePosition] = useState<Point | null>(null);
  const [mouseClick, setMouseClick] = useState<Point | null>(null);
  const [touchPosition, setTouchPosition] = useState<Point | null>(null);

  const canvas = document.querySelector('#root canvas');
  const normalize = (point: Point): Point => {
    const boundingBox = canvas.getBoundingClientRect();
    return {
        x: (point.x - boundingBox.left) * (canvas.width / boundingBox.width),
        y: (point.y - boundingBox.top) * (canvas.height / boundingBox.height)
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition(normalize({ x: e.clientX, y: e.clientY }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setMouseClick(normalize({ x: e.clientX, y: e.clientY }));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        setTouchPosition(normalize({ x: touch.clientX, y: touch.clientY }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return {
    mousePosition,
    mouseClick,
    touchPosition,
  };
}
