import { useEffect } from 'react';

export default function Loading(props) {

  useEffect(() => {

    if (props.fontsLoaded && props.allTexturesLoaded) {
      console.log('READY');
      setScene('Play');
    }

  }, [props]);

  return (
      <>
        <h1>Loading...{Math.round(props.texturesLoadingProgress * 100)}</h1>;
      </>
  );

}
