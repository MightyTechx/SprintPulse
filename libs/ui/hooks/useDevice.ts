import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

export interface UseDeviceResult {
  isXS: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useDevice(): UseDeviceResult {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.only('xs'));
  const isSM = useMediaQuery(theme.breakpoints.only('sm'));
  const isMD = useMediaQuery(theme.breakpoints.only('md'));
  const isLG = useMediaQuery(theme.breakpoints.only('lg'));
  const isXL = useMediaQuery(theme.breakpoints.only('xl'));

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMobile(isXS || isSM);
    setIsTablet(isMD || isLG);
    setIsDesktop(isXL);
  }, [isXS, isSM, isMD, isLG, isXL]);

  return { isXS, isSM, isMD, isLG, isXL, isMobile, isTablet, isDesktop };
}
