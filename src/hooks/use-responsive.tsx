
import { useState, useEffect } from 'react';

export interface Breakpoints {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

export function useResponsive() {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setBreakpoints({
        sm: width >= 640,
        md: width >= 768,
        lg: width >= 1024,
        xl: width >= 1280,
      });
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return breakpoints;
}

export function useIsMobile() {
  const breakpoints = useResponsive();
  return !breakpoints.md;
}
