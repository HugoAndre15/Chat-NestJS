"use client";
import { useState } from 'react';
import { login } from '../services/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { refreshUser } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.access_token) {
      localStorage.setItem('token', res.access_token);
      refreshUser(); 
      router.push('/');
    } else {
      alert('Erreur : ' + JSON.stringify(res));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Connexion</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="mb-4 w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required className="mb-6 w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition">Se connecter</button>
      </form>
    </div>
  );
}
