import { useRef, useState, useEffect } from 'react';
import { extend, useTick } from '@pixi/react';
import { Text } from 'pixi.js';
extend({ Text });

import { useGameStore } from '../store';
import { BigMessage } from '../components/BigMessage';
import { Button } from '../components/Button';

export default function About({ textures, setScene }) {

  const { SIZE } = useGameStore();

  const backButtonCallback = () => { setScene('Splash'); }

  return (
    <>
      <BigMessage size="40" fill="green" text={'About'} y={60} />
      <Button text="Back" pos={{x: 70, y: 380}} color="transparent" activeColor="white" callback={backButtonCallback} />
    </>
  );
}

