import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Assets, Texture, } from 'pixi.js';

const useTextureLoader = (imagePaths = []) => {
  const [textures, setTextures] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});
  const loadingRef = useRef(new Set());

  const loadTexture = useCallback(async (imagePath) => {
    // Skip if already loaded or currently loading
    if (textures[imagePath] || loadingRef.current.has(imagePath)) {
      return;
    }

    loadingRef.current.add(imagePath);
    
    // Set loading state
    setLoadingStates(prev => ({ ...prev, [imagePath]: true }));
    setErrors(prev => ({ ...prev, [imagePath]: null }));

    // Set placeholder texture immediately
    setTextures(prev => ({
      ...prev,
      [imagePath]: Texture.EMPTY
    }));

    try {
      const result = await Assets.load(imagePath);
      
      setTextures(prev => ({
        ...prev,
        [imagePath]: result
      }));
    } catch (error) {
      console.error(`Failed to load texture: ${imagePath}`, error);
      setErrors(prev => ({ ...prev, [imagePath]: error }));
      
      // Keep EMPTY texture on error
      setTextures(prev => ({
        ...prev,
        [imagePath]: Texture.EMPTY
      }));
    } finally {
      loadingRef.current.delete(imagePath);
      setLoadingStates(prev => ({ ...prev, [imagePath]: false }));
    }
  }, [textures]);

  // Load textures when imagePaths change
  useEffect(() => {
    imagePaths.forEach(loadTexture);
  }, [imagePaths, loadTexture]);

  // Utility functions
  const getTexture = useCallback((imagePath) => textures[imagePath], [textures]);
  
  const isLoading = useCallback((imagePath) => 
    loadingStates[imagePath] || false, [loadingStates]);
  
  const hasError = useCallback((imagePath) => 
    !!errors[imagePath], [errors]);
  
  const getError = useCallback((imagePath) => 
    errors[imagePath], [errors]);

  const allTexturesLoaded = useMemo(() => 
    imagePaths.length > 0 && imagePaths.every(path => 
      textures[path] && textures[path] !== Texture.EMPTY
    ), [imagePaths, textures]);

  const texturesLoadingProgress = useMemo(() => {
    if (imagePaths.length === 0) return 1;
    const loaded = imagePaths.filter(path => 
      textures[path] && textures[path] !== Texture.EMPTY
    ).length;
    return loaded / imagePaths.length;
  }, [imagePaths, textures]);

  return {
    textures,
    getTexture,
    isLoading,
    hasError,
    getError,
    allTexturesLoaded,
    texturesLoadingProgress,
  };
};


export default useTextureLoader;
