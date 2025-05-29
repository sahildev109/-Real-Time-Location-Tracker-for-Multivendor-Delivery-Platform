'use client';

import { useEffect, useState } from 'react';
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
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  let deliveryPartnerId: string | null = null;
if (typeof window !== 'undefined') {
  
  if (token) {
    const decoded = jwt_decode<DecodedToken>(token);
    deliveryPartnerId = decoded.id;
  }
}


  useEffect(() => {
    const fetchAssignedOrder = async () => {
      const res = await fetch('http://localhost:5000/api/delivery/assigned-order', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setOrder(null);
      }
    };

    fetchAssignedOrder();
  }, []);

  const startLocationSharing = () => {
    console.log('Starting location sharing...');
    if (!order || !deliveryPartnerId) return;
console.log('Starting location sharing for order:', order._id, 'by partner:', deliveryPartnerId);
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance); 
    setIsSharing(true);

    const emitLocation = () => {
      // Simulate changing location for now
      const lat = 19.1 + Math.random() * 0.01;
      const lng = 72.8 + Math.random() * 0.01;

      socketInstance.emit('locationUpdate', {
        orderId: order._id,
        deliveryPartnerId,
        lat,
        lng,
      });
    };

    emitLocation(); // First emit
    const interval = setInterval(emitLocation, 5000); // Repeat every 5s

    socketInstance.on('disconnect', () => {
      clearInterval(interval);
      setIsSharing(false);
    });
  };

  return (
    <ProtectedRoute allowedRoles={['delivery']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

        {order ? (
          <div className="border p-4 rounded bg-gray-100">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button
              onClick={startLocationSharing}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
              disabled={isSharing}
            >
              {isSharing ? 'Sharing Location...' : 'Start Sharing Location'}
            </button>
          </div>
        ) : (
          <p>No assigned orders.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
