'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Order {
  _id: string;
  address: string;
  status: 'pending' | 'assigned' | 'delivered';
  deliveryPartnerId?: { email: string };
}

interface DeliveryPartner {
  _id: string;
  email: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>('');
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
   const fetchOrders = async () => {
     
      console.log('Fetching orders with token:', token);
      const res = await fetch('http://localhost:5000/api/vendor/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

     const fetchDeliveryPartners = async () => {
    const res = await fetch('http://localhost:5000/api/vendor/delivery-partners', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDeliveryPartners(data);
  };

  const assignDeliveryPartner = async () => {
    if (!assigningOrderId || !selectedPartner) return;

    const res = await fetch('http://localhost:5000/api/vendor/assign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId: assigningOrderId,
        deliveryPartnerId: selectedPartner,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert('Delivery partner assigned!');
      setAssigningOrderId(null);
      setSelectedPartner('');
      fetchOrders(); // Refresh
    } else {
      alert(result.message || 'Error assigning partner');
    }
  };


  useEffect(() => {
   
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['vendor']}>
      <div className="p-8">
        <div className='flex justify-between items-center mb-6'>

        <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
        <button className='font-bold bg-red-600 p-2 border-none rounded-lg hover:cursor-pointer' onClick={()=>{
          localStorage.clear();
router.push('/login');

        }}>Log out</button>
        </div>

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
                      assigningOrderId === order._id ? (
                        <div className="flex gap-2 items-center">
                          <select
                            className="border px-2 py-1 text-sm"
                            value={selectedPartner}
                            onChange={(e) => setSelectedPartner(e.target.value)}
                          >
                            <option value="">Select Delivery Partner</option>
                            {deliveryPartners.map((dp) => (
                              <option key={dp._id} value={dp._id}>
                                {dp.email}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={assignDeliveryPartner}
                            className="bg-green-600 text-white px-3 py-1 text-sm rounded"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setAssigningOrderId(null)}
                            className="text-xs text-red-500"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAssigningOrderId(order._id)}
                          className="text-blue-500 underline text-sm"
                        >
                          Assign
                        </button>
                      )
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
