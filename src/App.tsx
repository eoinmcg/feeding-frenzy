import { useRef, useState, useEffect } from 'react';
import { Assets, Texture, } from 'pixi.js';
import { Application, extend, useTick } from '@pixi/react';
import { Container, Graphics, Sprite, Text, HTMLText } from 'pixi.js';

import WebFont from 'webfontloader';

extend({ Container, Graphics, Sprite, Text, HTMLText });
import { useGameStore } from './store';

import About from './scenes/About';
import Splash from './scenes/Splash';
import Play from './scenes/Play';
import Mute from './components/Mute';
import useCanvasResize from './hooks/useCanvasResize';

export default function App() {

  const imgs = ['fly.png', 'fly_2.png', 'frog.png', 'frog_bw.png', 'frog_belly.png', 'mouth_smile.png', 'mouth_sad.png', 'mouth_open.png', 'skull.png']
  const { SIZE, mute, toggleMute } = useGameStore();

  const [textures, setTextures] = useState({});
  const [scene, setScene] = useState('Splash')

  const resize = useCanvasResize(SIZE.w, SIZE.h);

  useEffect(() => {
    imgs.forEach((i) => {
      if (!textures[i]) {
        textures[i] = Texture.EMPTY;
        Assets.load(i)
          .then((result) => {
            textures[i] = result;
          });
      }
    })
  }, [textures]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyM') { toggleMute(); }
    }

    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    }
  }, []);


  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Press Start 2P', 'Roboto', 'Chelsea Market'],
      },
      active: () => {
        setFontLoaded(true);
      },
      inactive: () => {
        console.error('Google Fonts failed to load.');
      },
    });
  }, []);

  if (!fontLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
    <Mute mute={mute} handleToggleMute={toggleMute} />
    <Application width={SIZE.w} height={SIZE.h} background="lightblue">
      {scene === 'About' && <About textures={textures} setScene={setScene} />}
      {scene === 'Splash' && <Splash textures={textures} setScene={setScene} />}
      {scene === 'Play' && <Play textures={textures} setScene={setScene} mute={mute} plays={0} />}
    </Application>
    </>
  );
}
