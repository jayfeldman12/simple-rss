'use client';

import {useEffect, useState} from 'react';

export const useWindowDimensions = () => {
  const [windowHeight, setWindowHeight] = useState<number>(1200);
  const [windowWidth, setWindowWidth] = useState<number>(900);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    }
  }, []);

  return {windowHeight, windowWidth};
};
