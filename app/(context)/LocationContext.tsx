import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from '@/hooks/useLocation'; // Your existing hook

// 1. Define the shape of the context data
type LocationContextType = {
  location: string | null;
  setLocation: (location: string | null) => void;
  isLoading: boolean;
};

// 2. Create the context with a default value
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// 3. Create the Provider component
export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Use your hook *inside* the provider
  const { location: deviceLocation, loading: isLocationLoading } = useLocation();

  // Set the initial location from the device, but only once
  useEffect(() => {
    if (deviceLocation && !selectedLocation) {
      setSelectedLocation(deviceLocation);
    }
  }, [deviceLocation]);

  const value = {
    location: selectedLocation,
    setLocation: setSelectedLocation,
    isLoading: isLocationLoading && !selectedLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

// 4. Create a custom hook to easily use the context
export function useGlobalLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useGlobalLocation must be used within a LocationProvider');
  }
  return context;
}
