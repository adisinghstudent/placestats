// app/components/Map.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

interface MapProps {
  onLocationSelect: (coordinates: { lng: number; lat: number }) => void;
}

function Map({ onLocationSelect }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null)
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/adis123/cm2trla51000q01qw78sv431j',
      center: [10.7522, 59.9139],
      zoom: 10
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('click', (e) => {
      const coordinates = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      };

      // Remove existing marker if it exists
      if (marker) {
        marker.remove();
      }

      // Create and add new marker
      const newMarker = new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map.current!);
      
      setMarker(newMarker);
      onLocationSelect(coordinates);

      fetch('/api/saveLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          longitude: coordinates.lng,
          latitude: coordinates.lat
        }),
      }).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    });

    // Cleanup function
    return () => {
      if (marker) {
        marker.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [marker, onLocationSelect]); // Add dependencies here

  return (
    <div className="relative">
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Location saved successfully!
        </div>
      )}
    </div>
  );
}

export default Map;
