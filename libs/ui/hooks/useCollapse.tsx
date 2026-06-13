import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDevice } from './useDevice';

interface CollapseContextType {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const CollapseContext = createContext<CollapseContextType | undefined>(undefined);

export function CollapseProvider({ children }: { children: ReactNode }) {
  const { isXS, isSM } = useDevice();
  const isMobileDevice = isXS || isSM;

  // Always default to collapsed on mount — never restore an expanded state on refresh
  const [collapsed, setCollapsed] = useState(() => {
    if (isMobileDevice) return true;
    // Always start collapsed on initial page load; toggle will persist to localStorage
    return true;
  });

  // If device becomes mobile, force collapse
  useEffect(() => {
    if (isMobileDevice) setCollapsed(true);
  }, [isMobileDevice]);

  // Toggle and persist the new state
  const toggleCollapse = () =>
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sideNavCollapsed', String(next));
      return next;
    });

  return (
    <CollapseContext.Provider value={{ collapsed, toggleCollapse }}>
      {children}
    </CollapseContext.Provider>
  );
}

export const useCollapse = () => {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error('useCollapse must be used within a CollapseProvider');
  }
  return context;
};
