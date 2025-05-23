import { useEffect, useState } from 'react';
import { Text } from 'pixi.js';

export function Timer({ time }) {

  const [style, setStyle] = useState();

  const base = {
      fontFamily: 'Chelsea Market',
      fontSize: 50,
      fontWeight: 'bold',
      stroke: '#fff',
      strokeThickness: 3,
      fill: 0x000000,
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
