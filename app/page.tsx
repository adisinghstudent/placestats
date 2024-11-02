// app/page.tsx
import { useState, useEffect } from 'react';
import Map from './components/Map';
import Spline from '@splinetool/react-spline';
import styles from './page.module.css';

export default function Home() {
  const [coordinates, setCoordinates] = useState<{ lng: number; lat: number }>({ lng: 0, lat: 0 });
  const [locationName, setLocationName] = useState<string>('');
  const [country, setCountry] = useState<string>('');

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
          // Fetch country when coordinates are loaded
          fetchCountry(data.currentLocation.longitude, data.currentLocation.latitude);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchSavedLocation();
  }, []);

  const fetchCountry = async (lng: number, lat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=country`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setCountry(data.features[0].place_name);
      }
    } catch (error) {
      console.error('Error fetching country:', error);
    }
  };

  const handleLocationSelect = (coords: { lng: number; lat: number }) => {
    setCoordinates(coords);
    fetchCountry(coords.lng, coords.lat);
  };

  return (
    <main className={styles.container}>
      <div className="splineContainer" style={{ height: '50vh', overflow: 'hidden' }}>
        <Spline scene="https://prod.spline.design/Yjqw4vZ2JkMXmMSR/scene.splinecode" />
      </div>
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
        <div className={styles.countryContainer}>
          <h3>Country</h3>
          <p>{country || 'Loading...'}</p>
        </div>
      </div>
    </main>
  );
}
