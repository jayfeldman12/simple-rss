'use client';

import {useEffect, useState} from 'react';

export const useWindowDimensions = () => {
  const [windowHeight, setWindowHeight] = useState<number | string>('100rem');
  const [windowWidth, setWindowWidth] = useState<number | string>('100rem');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    }
  }, []);

  return {windowHeight, windowWidth};
};
