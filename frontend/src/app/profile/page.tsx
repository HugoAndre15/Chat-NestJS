'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, logout } from '@/app/services/auth';
import { useAuth } from '@/app/context/AuthContext';

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; username: string; color: string } | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const me = await getMe();
      if (!me) {
        router.push('/login');
      } else {
        setUser(me);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    logout();
    refreshUser();
    router.push('/login');
  };

  const colors = ['red', 'blue', 'green', 'purple', 'orange', 'black'];

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#18191A]">
      <div className="w-full max-w-md bg-[#232324] rounded-2xl shadow-lg p-8 flex flex-col items-center">
        {/* Photo de profil */}
        <div className="flex flex-col items-center w-full border-b border-[#313233] pb-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mb-2 text-white text-lg font-semibold cursor-pointer">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex gap-2 mb-4">
        {colors.map((c) => (
            <button
            key={c}
            className={`w-6 h-6 rounded-full border-2 ${user?.color === c ? 'border-black' : 'border-white'}`}
            style={{ backgroundColor: c }}
            onClick={async () => {
                await fetch('http://localhost:3000/users/color', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ color: c }),
                });
                router.refresh();
                refreshUser();
            }}
            />
        ))}
        </div>
        {/* Formulaire */}
        <form className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Nom affiché</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-[#18191A] text-white border-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
              placeholder="Nom affiché"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-[#18191A] text-white border-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
              placeholder="Email"
            />
          </div>
          <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-[#313233] hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
            Retour
          </button>
          <button type="button" onClick={handleLogout} className="flex-1 bg-[#ff0000] hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition">Deconnexion</button>
          </div>
        </form>
      </div>
    </div>
  );
}
