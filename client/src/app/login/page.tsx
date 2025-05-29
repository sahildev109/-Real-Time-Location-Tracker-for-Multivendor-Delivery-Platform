'use client'

import { useEffect } from 'react';
import AuthForm from '../../components/AuthForm';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
const router = useRouter();
 useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      router.push(`/dashboard/${role}`);
    }
  }, [router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/1234.png')] bg-cover bg-center h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome</h1>
        <AuthForm />
      </div>
    </div>
  );
}
