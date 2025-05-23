import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';

/**
 * Custom hook to load Google Fonts
 * @param {string[]} families - Array of font family names to load
 * @returns {boolean} - Whether fonts have loaded successfully
 */
const useFontLoader = (families = ['Press Start 2P', 'Roboto', 'Chelsea Market']) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  
  useEffect(() => {
    WebFont.load({
      google: {
        families,
      },
      active: () => {
        setFontLoaded(true);
      },
      inactive: () => {
        setFontLoaded(true);
        // console.error('Google Fonts failed to load.');
      },
    });
  }, [families]);

  return fontLoaded;
};

export default useFontLoader;
