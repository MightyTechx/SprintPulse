import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../services/storage';

export type AppType = 'PTW' | 'Maintenance';

interface AppTypeContextType {
  appType: AppType;
  setAppType: (type: AppType) => void;
  isInitialized: boolean;
}

const AppTypeContext = createContext<AppTypeContextType | undefined>(undefined);

const STORAGE_KEY = 'app_type';

export function AppTypeProvider({ children }: { children: ReactNode }) {
  const [appType, setAppTypeState] = useState<AppType>('PTW');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load saved app type on mount
    try {
      const saved = storage.getString(STORAGE_KEY);
      if (saved === 'PTW' || saved === 'Maintenance') {
        setAppTypeState(saved);
      }
    } catch (e) {
      // storage might fail
    }
    setIsInitialized(true);
  }, []);

  const setAppType = (type: AppType) => {
    setAppTypeState(type);
    try {
      storage.set(STORAGE_KEY, type);
    } catch (e) {
      // storage might fail
    }
  };

  return (
    <AppTypeContext.Provider value={{ appType, setAppType, isInitialized }}>
      {children}
    </AppTypeContext.Provider>
  );
}

export function useAppType() {
  const context = useContext(AppTypeContext);
  if (context === undefined) {
    throw new Error('useAppType must be used within an AppTypeProvider');
  }
  return context;
}