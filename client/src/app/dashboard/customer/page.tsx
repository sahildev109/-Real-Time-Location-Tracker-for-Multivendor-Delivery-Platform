'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';

export default function VendorDashboard() {
  return (
    <ProtectedRoute allowedRoles={['customer']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <p>Welcome, vendor!</p>
      </div>
    </ProtectedRoute>
  );
}
