'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Order {
  _id: string;
  address: string;
  status: string;
  customerId: { email: string };
  vendorId: { email: string };
}

export default function DeliveryDashboard() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

      setLoading(false);
    };

    fetchAssignedOrder();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['delivery']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Delivery Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : order ? (
          <div className="border p-4 rounded bg-gray-100">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Vendor:</strong> {order.vendorId?.email}</p>
            <p><strong>Customer:</strong> {order.customerId?.email}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Start Sharing Location (next step)
            </button>
          </div>
        ) : (
          <p>No assigned orders yet.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
