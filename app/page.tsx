// app/page.tsx
'use client'
import Map from './components/Map'
import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({ lng: 0, lat: 0 });
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    const fetchSavedLocation = async () => {
      try {
        const response = await fetch('/api/getLocation');
        const data = await response.json();
        if (data.currentLocation) {
          setCoordinates({
            lng: data.currentLocation.longitude,
            lat: data.currentLocation.latitude
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchSavedLocation();
  }, []);

  const handleLocationSelect = (coords: { lng: number; lat: number }) => {
    setCoordinates(coords);
  };
  
  return (
    <main className={styles.container}>
      <div className={styles.mapContainer}>
        <Map onLocationSelect={handleLocationSelect} />
      </div>
      <div className={styles.coordinatesContainer}>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Enter location name"
          className={styles.locationInput}
        />
        <h2>Selected Location</h2>
        <p>Longitude: {coordinates.lng.toFixed(6)}</p>
        <p>Latitude: {coordinates.lat.toFixed(6)}</p>
      </div>
    </main>
  )
}
