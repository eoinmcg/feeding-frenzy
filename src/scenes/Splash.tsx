import {  useEffect } from 'react';

import { useGameStore } from '../store';
import { BigMessage } from '../components/BigMessage';
import { Button } from '../components/Button';

export default function Splash({ textures, setScene }) {

  const { SIZE } = useGameStore();

  const playButtonCallback = () => { setScene('Play'); }
  const play2ButtonCallback = () => { setScene('Play2Local'); }
  const aboutButtonCallback = () => { setScene('About'); }

  return (
    <>
      <BigMessage size="40" fill="green" text={'FEEDING'} y={60} />
      <BigMessage text={'FRENZY'} fill="green" x={30} y={100} />
      <Button text="Play" pos={{x: 70, y: 270}} color="hotpink" activeColor="purple" callback={playButtonCallback} />
      <Button text="2 Play" pos={{x: 70, y: 320}} xPos={-10} color="orange" activeColor="green" callback={play2ButtonCallback} />
      <Button text="About" pos={{x: 70, y: 420}} xPos={-10} color="transparent" activeColor="white" fontSize={20} callback={aboutButtonCallback} />
    </>
  );
}
