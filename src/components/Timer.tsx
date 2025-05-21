import { useEffect, useState } from 'react';
import { extend, useTick } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

export function Timer({ time }) {

  const [style, setStyle] = useState();

  const base = {
      fontFamily: 'Chelsea Market',
      fontSize: 50,
      fontWeight: 'bold',
      stroke: '#fff',
      strokeThickness: 3,
      fill: 0x000000, // Green
  }

  useEffect(() => {

    setStyle(new Text(base));

  }, []);

  return (
    <>
      <pixiText
        x={110}
        y={10}
        text={Math.ceil(time)}
        style={style}
        />
    </>

  );

}
