'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  id: string;
  email: string;
  role: 'vendor' | 'delivery' | 'customer';
}

interface Order {
  _id: string;
  address: string;
  status: string;
  customerId: { email: string };
  vendorId: { email: string };
}

export default function DeliveryDashboard() {
  const [order, setOrder] = useState<Order | null>(null);
  const [deliveryPartnerId, setDeliveryPartnerId] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Decode JWT safely
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwt_decode<DecodedToken>(token);
      setDeliveryPartnerId(decoded.id);
    } catch (err) {
      console.error('JWT decode failed:', err);
    }
  }, [token]);

  // Fetch assigned order
  useEffect(() => {
    if (!token) return;

    const fetchAssignedOrder = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/delivery/assigned-order', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setOrder(data);
        } else {
          setOrder(null);
          console.warn('No assigned order found.');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setOrder(null);
      }
    };

    fetchAssignedOrder();
  }, [token]);

  // Start location sharing
  const startLocationSharing = () => {
    if (!order || !deliveryPartnerId) return;

    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    setIsSharing(true);
  localStorage.setItem('isSharingLocation', 'true');
    const emitLocation = () => {
      const lat = 19.1 + Math.random() * 0.01;
      const lng = 72.8 + Math.random() * 0.01;

      socket.emit('locationUpdate', {
        orderId: order._id,
        deliveryPartnerId,
        lat,
        lng,
      });
    };

    emitLocation();
    intervalRef.current = setInterval(emitLocation, 5000);

    socket.on('disconnect', () => {
      clearInterval(intervalRef.current!);
      setIsSharing(false);
    });
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

useEffect(() => {
  const shouldResume = localStorage.getItem('isSharingLocation') === 'true';
  if (!isSharing && order && deliveryPartnerId && shouldResume) {
    startLocationSharing();
  }
}, [order, deliveryPartnerId]);

const handleDelivered = async () => {

}

  return (
    <ProtectedRoute allowedRoles={['delivery']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

        {!order ? (
          <p className="text-gray-600">No assigned orders.</p>
        ) : (
          <div className="border p-4 rounded bg-gray-100">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button
              onClick={startLocationSharing}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSharing}
            >
              {isSharing ? 'Sharing Location...' : 'Start Delivery'}
            </button>
            {isSharing && (
              <button
                onClick={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  if (socketRef.current) socketRef.current.disconnect();
                  setIsSharing(false);
                  localStorage.removeItem('isSharingLocation');
                }}
                className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Delivered
              </button>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
