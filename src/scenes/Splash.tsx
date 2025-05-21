import { useRef, useState, useEffect } from 'react';
import { extend, useTick } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

import { useGameStore } from '../store';
import { BigMessage } from '../components/BigMessage';
import { Button } from '../components/Button';

export default function Splash({ textures, setScene }) {

  const { SIZE } = useGameStore();

  const playButtonCallback = () => { setScene('Play'); }
  const aboutButtonCallback = () => { setScene('About'); }

  return (
    <>
      <BigMessage size="40" fill="green" text={'FEEDING'} y={60} />
      <BigMessage text={'FRENZY'} fill="green" x={30} y={100} />
      <Button text="Play" pos={{x: 70, y: 320}} color="hotpink" activeColor="purple" callback={playButtonCallback} />
      <Button text="About" pos={{x: 70, y: 380}} color="transparent" activeColor="white" callback={aboutButtonCallback} />
    </>
  );
}
