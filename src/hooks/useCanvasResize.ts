import { useEffect, useCallback } from 'react';

/**
 * Custom hook to resize a canvas element to fit the screen while maintaining aspect ratio
 * @param {number} width - Original canvas width
 * @param {number} height - Original canvas height
 * @param {string} selector - CSS selector for the canvas element (default: '#root canvas')
 * @returns {Function} - Function to manually trigger resize
 */
const useCanvasResize = (width, height, selector = '#root canvas') => {
  const resizeCanvas = useCallback(() => {
    const canvas = document.querySelector(selector);
    if (!canvas) return;
    
    // Set original dimensions
    canvas.width = width;
    canvas.height = height;
    
    const widthToHeight = width / height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    const newWidthToHeight = newWidth / newHeight;
    
    // Adjust dimensions to maintain aspect ratio
    if (newWidthToHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight;
    } else {
      newHeight = newWidth / widthToHeight;
    }
    
    // Apply styles to center and size the canvas
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    canvas.style.marginTop = `${-newHeight / 2}px`;
    canvas.style.marginLeft = `${-newWidth / 2}px`;
    canvas.style.display = 'block';
  }, [width, height, selector]);

  // Add resize event listener
  useEffect(() => {
    // Initial resize
    window.setTimeout(() => {
      resizeCanvas();
    }, 500)
    
    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  // Return the resize function in case it needs to be manually triggered
  return resizeCanvas;
};

export default useCanvasResize;
