'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';

const defaultPosition: [number, number] = [19.076, 72.8777]; // Mumbai as default
const customIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
  iconSize: [30, 30],
});

export default function CustomerDashboard() {
  const [location, setLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('locationUpdate', (data) => {
      console.log('📡 Received location update:', data);
      setLocation([data.lat, data.lng]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>

        <MapContainer
          center={location || defaultPosition}
          zoom={13}
          scrollWheelZoom
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {location && (
            <Marker position={location} icon={customIcon}>
              <Popup>Delivery Partner Location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </ProtectedRoute>
  );
}
