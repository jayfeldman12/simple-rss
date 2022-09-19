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
        className={`container-fluid text-center py-5 px-5 bg-dark text-white height-full`}
        style={{
          minHeight: windowHeight,
        }}>
        {children}
      </div>
    </main>
  );
};
