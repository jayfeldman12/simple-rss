import {useState, useEffect} from 'react';

const defaultWindow = {
  innerWidth: 100,
  innerHeight: 100,
  width: 100,
  height: 100,
};

function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} =
    typeof window !== 'undefined' ? window : defaultWindow;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<{
    height: number;
    width: number;
  }>(defaultWindow);

  useEffect(() => {
    setWindowDimensions(getWindowDimensions());
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
