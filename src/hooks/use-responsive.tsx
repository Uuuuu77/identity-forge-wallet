
import { useState, useEffect } from 'react';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState<ResponsiveInfo>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
          sm: width >= 640,
          md: width >= 768,
          lg: width >= 1024,
          xl: width >= 1280,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

export function useIsMobile() {
  const { isMobile } = useResponsive();
  return isMobile;
}
