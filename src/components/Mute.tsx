
export default function Mute({mute, handleToggleMute}) {
  return (
      <button className={mute ? 'mute muted': 'mute'} onClick={handleToggleMute}></button>
  );
}

