import { useEffect,  useState } from 'react';
import { extend, useTick } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

import { comboSmall, comboLarge } from '../textStyles';
import sfx from '../helpers/sfx';

export function Combo({defaultColor, text, pos, reset}) {

  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [color, setColor] = useState(defaultColor);
  const [textSmall, setTextSmall] = useState();
  const [textLarge, setTextLarge] = useState();

  useEffect(() => {
    setOffset(0);
    setOpacity(1);
    comboSmall.fill = color;
    comboLarge.fill = color;

    setTextSmall(new Text(comboSmall));
    setTextLarge(new Text(comboLarge));


  }, [text]);

  useTick((tick) => {
    setOffset(offset - tick.deltaTime / 1.2);
    setOpacity(opacity - tick.deltaTime / 100);
    if (opacity < 0) {
      reset(0);
    }
  });

  if (!text) return (<></>);

  return (
    <>
      <pixiText
        angle={opacity * 5}
        alpha={opacity}
        x={pos.x - 35} y={pos.y - 80 + offset}
        text="COMBO"
        style={textSmall}
        />

      <pixiText
        angle={opacity * -5}
        alpha={opacity}
        x={pos.x - 9} y={pos.y - 60 + offset}
        text={text}
        style={textLarge}
        />
      </>

  );

}

