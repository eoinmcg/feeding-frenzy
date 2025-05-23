import { useEffect, useState } from 'react';
import { extend, useTick } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

export function BigMessage(props) {

  const [style, setStyle] = useState();
  const [alpha, setAlpha] = useState(1);

  const base = {
      fontFamily: 'Chelsea Market',
      fontSize: props.size || 60,
      fontWeight: 'bold',
      stroke: {
          color: '#fff',
          width: 3
      },
      textAlign: 'center',
      fill: props.fill || 0xcc2200,
  }

  if (props.texture) { base.texture = props.texture; }
  if (props.angle) { base.angle = props.angle; }

  useEffect(() => {
    setStyle(new Text(base));
  }, []);

  useTick((tick) => {
    // setAlpha(Math.sin(performance.now()) * 1000);

  });

  return (
    <>
      <pixiText
        alpha={alpha}
        x={props.x || 50}
        y={props.y || 200}
        text={props.text}
        style={style}
        />
    </>

  );

}

