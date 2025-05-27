"use client";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: { username: string } | null;
  refreshUser: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshUser: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; color: string } | null>(null);

  const refreshUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => setUser(data && data.username && data.color ? { username: data.username, color: data.color } : null))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') refreshUser();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}