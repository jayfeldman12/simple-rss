'use client';

import {useWindowDimensions} from '../../hooks/useWindowDimensions';

export interface BackgroundProps {
  children?: React.ReactNode;
}

export const Background = ({children}: BackgroundProps) => {
  const {windowHeight} = useWindowDimensions();

  return (
    <main>
      <div
        className={`container-fluid text-center bg-dark text-white height-full g-0`}
        style={{minHeight: windowHeight}}>
        {children}
      </div>
    </main>
  );
};
