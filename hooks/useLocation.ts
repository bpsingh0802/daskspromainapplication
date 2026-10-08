import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  location: string | null;
  loading: boolean;
  error: string | null;
}

export const useLocation = (): LocationData | null => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      setError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied.');
          // If permission is denied, use a default so the app works.
          setLocation('Khurja, Uttar Pradesh'); 
          return;
        }

        const currentPosition = await Location.getCurrentPositionAsync({ timeout: 5000 });
        const { latitude, longitude } = currentPosition.coords;

        // Try to convert coordinates to a city name
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

        // If successful, use the real city name.
        if (geocode.length > 0 && geocode[0].city) {
          const formattedLocation = `${geocode[0].city}, ${geocode[0].region}`;
          setLocation(formattedLocation);
        } else {
          // **FALLBACK:** If it fails, use a default location. This fixes the "digits" issue.
          console.warn("Could not determine location name. Using default.");
          setLocation('Khurja, Uttar Pradesh'); 
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Failed to fetch location.');
        // If there's an error, also fall back to the default.
        setLocation('Khurja, Uttar Pradesh');
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []); // Empty array means this runs only once.

  return { location, loading, error };
};