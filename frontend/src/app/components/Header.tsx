"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-sm z-50">
      <span className="text-white font-bold text-xl cursor-pointer" onClick={() => window.location.href = "/"}>ChatApp</span>
      <nav className="flex items-center gap-6">
        {user ? (
          <Link href="/profile" className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 transition">
            <span className="font-semibold text-white">{user.username}</span>
            <span className="ml-2 text-xs text-green-400 bg-gray-700 rounded-full px-2 py-1">Connecté</span>
          </Link>
        ) : (
          <>
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">Connexion</Link>
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition">Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}