'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';

export default function VendorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['delivery']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
        <p>Welcome, vendor!</p>
      </div>
    </ProtectedRoute>
  );
}
