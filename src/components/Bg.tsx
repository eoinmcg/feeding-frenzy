export function Bg({textures}) {

  return (
    <>
      <pixiSprite
        anchor={0.5}
        scale={3}
        texture={textures['ground.png']}
        x={0}
        y={300}
      />
      <pixiSprite
        alpha={0.1}
        texture={textures['bg.png']}
        x={0}
        y={0}
      />
    </>
  );
}
