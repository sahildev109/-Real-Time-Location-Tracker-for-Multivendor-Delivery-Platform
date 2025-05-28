'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '../types/user';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');
  const [role, setRole] = useState<Role>('vendor');
  const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        router.push(`/dashboard/${data.user.role}`);
      } else {
        alert('Signup successful. You can now log in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
    { !isLogin &&  (<input
        type="password"
        placeholder="Confirm Password"
        value={Cpassword}
        required
        onChange={(e) => setCPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />)}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="w-full p-2 border rounded"
      >
        <option value="vendor">Vendor</option>
        <option value="delivery">Delivery Partner</option>
        <option value="customer">Customer</option>
      </select>
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isLogin ? 'Login' : 'Signup'}
      </button>
      <p className="text-center text-sm">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </span>
      </p>
    </form>
  );
}
