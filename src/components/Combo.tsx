import { useEffect, useState, useMemo } from 'react';
import { useTick } from '@pixi/react';
import { comboSmall, comboLarge } from '../textStyles';

export function Combo({ defaultColor, text, pos, reset }) {
  const [animationState, setAnimationState] = useState({
    offset: 0,
    opacity: 1,
    isActive: false,
    currentText: 0
  });

  const smallStyle = useMemo(() => ({
    ...comboSmall,
    fill: defaultColor
  }), [defaultColor]);

  const largeStyle = useMemo(() => ({
    ...comboLarge,
    fill: defaultColor
  }), [defaultColor]);

  // Reset animation when text changes and is greater than 0
  useEffect(() => {
    if (text > 0 && text !== animationState.currentText) {
      setAnimationState({
        offset: 0,
        opacity: 1,
        isActive: true,
        currentText: text
      });
    }
  }, [text, defaultColor, animationState.currentText]);

  useTick((tick) => {
    if (!animationState.isActive) return;

    const deltaTime = tick.deltaTime;
    
    setAnimationState(prev => {
      const newOffset = prev.offset - deltaTime / 1.2;
      const newOpacity = prev.opacity - deltaTime / 100;
      
      // Reset when animation is complete
      if (newOpacity <= 0) {
        // Use setTimeout to avoid calling reset during render
        setTimeout(() => reset(0), 0);
        return {
          ...prev,
          isActive: false,
          opacity: 0,
          offset: newOffset
        };
      }
      
      return {
        ...prev,
        offset: newOffset,
        opacity: newOpacity
      };
    });
  });

  // Don't render if not active or no text
  if (!animationState.isActive || !text || text <= 0) {
    return null;
  }

  return (
    <>
      <pixiText
        angle={animationState.opacity * 5}
        alpha={Math.max(0, animationState.opacity)}
        x={pos.x - 35} 
        y={pos.y - 80 + animationState.offset}
        text="COMBO"
        style={smallStyle}
      />
      <pixiText
        angle={animationState.opacity * -5}
        alpha={Math.max(0, animationState.opacity)}
        x={pos.x - 9} 
        y={pos.y - 60 + animationState.offset}
        text={animationState.currentText.toString()}
        style={largeStyle}
      />
    </>
  );
}
