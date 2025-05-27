"use client";
import { useState } from 'react';
import { register } from '../services/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { refreshUser } = useAuth();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await register(email, password, username, '#ffffff');
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
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Inscription</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="mb-4 w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nom d'utilisateur" required className="mb-4 w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required className="mb-6 w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-3 rounded-lg transition">S'inscrire</button>
      </form>
    </div>
  );
}
