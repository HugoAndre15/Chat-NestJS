'use client';

import Chat from '../components/Chat';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Optionnel : vérifier que le token est valide en appelant /users/me
    fetch('http://localhost:3000/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Unauthorized');
      })
      .then(() => {
        setAuthorized(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!authorized) return null;

  return (
    <main className="p-4">
      <Chat />
    </main>
  );
}
