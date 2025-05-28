'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Order {
  _id: string;
  address: string;
  status: 'pending' | 'assigned' | 'delivered';
  deliveryPartnerId?: { email: string };
}

export default function VendorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token);
      const res = await fetch('http://localhost:5000/api/vendor/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['vendor']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Address</th>
                <th className="p-2">Status</th>
                <th className="p-2">Delivery Partner</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-2">{order.address}</td>
                  <td className="p-2 capitalize">{order.status}</td>
                  <td className="p-2">
                    {order.deliveryPartnerId?.email || 'Unassigned'}
                  </td>
                  <td className="p-2">
                    {order.status === 'pending' ? (
                      <button className="text-sm text-blue-500 underline">
                        Assign
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}
