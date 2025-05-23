import {  useEffect } from 'react';
import { useGameStore } from '../store';

export default function Mute() {

  const { mute, toggleMute } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyM') { toggleMute(); }
    }
    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    }
  });

  return (
    <button className={mute ? 'mute muted': 'mute'} onClick={toggleMute}>
    </button>
  );
}

