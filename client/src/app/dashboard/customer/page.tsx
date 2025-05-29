'use client';


import { useEffect, useState } from 'react';

import { io } from 'socket.io-client';
import ProtectedRoute from '@/components/ProtectedRoute';
import dynamic from 'next/dynamic';

const defaultPosition: [number, number] = [19.076, 72.8777]; // Mumbai as default

const MapView = dynamic(
  () => import('../../../components/MapViewComponent'), // Create this new component
  { 
    ssr: false,
    loading: () => <p className="h-[500px] flex items-center justify-center">Loading map...</p>
  }
);

interface Order {
  _id: string;
  address: string;
  status: string;
  vendorId: { email: string };
  deliveryPartnerId?: { email: string };
}

export default function CustomerDashboard() {
  const [location, setLocation] = useState<[number, number] | null>(null);
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  

     useEffect(() => {
      setLoading(true);
    const fetchOrder = async () => {
      const res = await fetch('http://localhost:5000/api/customer/customer-order', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        alert('No active order found.');
      }
      setLoading(false);
    };

    fetchOrder();
  }, []);
console.log('Orders:', orders);
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

<MapView location={location} />

        <h1 className="text-2xl font-bold">Your Orders</h1>

        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Address</th>
              <th className="p-2">Status</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Delivery Partner</th>
              
            </tr>
          </thead>
          <tbody>
            {loading ? (
  <tr>
    <td colSpan={5} className="p-4 text-center text-gray-500">
      Loading orders...
    </td>
  </tr>
) : orders.length > 0 ? (
  orders.map((order) => (
    <tr key={order._id} className="border-t">
      <td className="p-2">{order.address}</td>
      <td className="p-2 capitalize">{order.status}</td>
      <td className="p-2">{order.vendorId?.email}</td>
      <td className="p-2">{order.deliveryPartnerId?.email || 'Unassigned'}</td>
      
    </tr>
  ))
) : (
  <tr>
    <td colSpan={5} className="p-4 text-center text-gray-400">
      No orders found.
    </td>
  </tr>
)}

          </tbody>
        </table>

        
      </div>
    </ProtectedRoute>
  );
}
