// frontend/services/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function register(email: string, password: string, username: string, color: "#ffffff") {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username, color }),
    });
    return res.json();
}
  
export async function login(email: string, password: string, username: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    return res.json();
}

export async function getMe() {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const res = await fetch('http://localhost:3000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }  
      return await res.json();
    } catch (err) {
      console.error('Erreur lors de la récupération de l’utilisateur :', err);
      return null;
    }
  }

export function logout() {
    localStorage.removeItem('token');
}

