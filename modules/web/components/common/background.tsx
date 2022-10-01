import {useState, useEffect} from 'react';

export interface BackgroundProps {
  children?: React.ReactNode;
}

export const Background = ({children}: BackgroundProps) => {
  const [windowHeight, setWindowHeight] = useState<number | string>('100rem');

  useEffect(() => {
    if (typeof window !== 'undefined') setWindowHeight(window.innerHeight);
  }, []);

  return (
    <main>
      <div
        className={`container-fluid text-center bg-dark text-white height-full g-0`}
        style={{
          minHeight: windowHeight,
        }}>
        {children}
      </div>
    </main>
  );
};
