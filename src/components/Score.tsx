import { useState, useEffect } from 'react';
import { useTick } from '@pixi/react';
import { Text } from 'pixi.js';

import { scoreSmall } from '../textStyles';

export function Score({player, score}) {

  const [style, setStyle] = useState();

  useEffect(() => {

    setStyle(new Text(scoreSmall));

  }, []);


  return (
    <>
      <pixiHTMLText
        x={player.pos.x - 10}
        y={player.pos.y + 30}
        text={` ${score} `}
        style={style}
        />
      </>

  );

}
