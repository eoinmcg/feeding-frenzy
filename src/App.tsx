import {  useState } from 'react';

import { Application, extend } from '@pixi/react';
import { Container, Graphics, Sprite, Text, HTMLText } from 'pixi.js';
extend({ Container, Graphics, Sprite, Text, HTMLText });

import { useGameStore } from './store';

import useCanvasResize from './hooks/useCanvasResize';
import useFontLoader from './hooks/useFontLoader';
import useTextureLoader from './hooks/useTextureLoader';

import Loading from './scenes/Loading';
import About from './scenes/About';
import Splash from './scenes/Splash';
import Play from './scenes/Play';
import Play2Local from './scenes/Play2Local';
import Mute from './components/Mute';

export default function App() {

  const imgs = ['fly.png', 'fly_2.png', 'frog_bw.png', 'frog_belly.png', 
    'mouth_smile.png', 'mouth_sad.png', 'mouth_open.png', 'bg.png', 
    'skull.png', 'poop.png', 'flower.png', 'powerup.png', 'wasp.png'
  ];
  const { SIZE, mute } = useGameStore();

  const [scene, setScene] = useState('Splash')

  useCanvasResize(SIZE.w, SIZE.h);
  const { textures, getTexture, allTexturesLoaded, texturesLoadingProgress } = useTextureLoader(imgs);

  const fontsLoaded = useFontLoader();
  if (!fontsLoaded || !allTexturesLoaded) {
    return (
      <>
        <h1>Loading...{Math.round(texturesLoadingProgress * 100)}%</h1>;
      </>
    );
  }

  return (
    <>
    <Mute />
    <Application width={SIZE.w} height={SIZE.h} background="lightblue">
      {scene === 'Loading' && <Loading setScene={setScene} fontsLoaded={fontsLoaded} allTexturesLoaded={allTexturesLoaded} texturesLoadingProgress={texturesLoadingProgress}  />}
      {scene === 'About' && <About textures={textures} setScene={setScene} mute={mute} />}
      {scene === 'Splash' && <Splash textures={textures} setScene={setScene} mute={mute} />}
      {scene === 'Play' && <Play textures={textures} setScene={setScene} mute={mute} plays={0} />}
      {scene === 'Play2Local' && <Play2Local textures={textures} setScene={setScene} mute={mute} plays={0} />}
    </Application>
    </>
  );
}
