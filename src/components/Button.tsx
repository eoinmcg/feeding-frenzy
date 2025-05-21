import { useState } from 'react';
import { extend } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

import { useGameStore } from '../store';
import { buttonLarge } from '../textStyles';
import sfx from '../helpers/sfx';

export function Button(props) {

  const { SIZE } = useGameStore();

  const [bgColor, setBgColor] = useState(props.color);
  const textStyle = new Text(buttonLarge);

  return (
    <>
    <pixiContainer x={props.pos.x} y={props.pos.y}
        onPointerOver={(e) => {
          setBgColor(props.activeColor);
        }}
        onPointerOut={(e) => {
          setBgColor(props.color);

        }}
        eventMode={'static'}
        onClick={(e) => {
          sfx('crash');
          props.callback();
        }}
        onTouchEnd={(e) => {
          sfx('crash');
          props.callback();
        }}
      >
      <pixiGraphics
        x={0} y={0}
        draw={(g) => {
          g.clear().rect(0, 0, 120, 45).fill(bgColor);
        }}
      />
      <pixiText
        text={props.text}
        x={30} y={5}
        style={textStyle}
        />
    </pixiContainer>
    </>
  );
}
