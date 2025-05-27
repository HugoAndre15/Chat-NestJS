'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

type Message = {
  username: string;
  message: string;
  timestamp: string;
  color: string;
};

export default function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<{ username: string, color: string }[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000');
    }
    const socket = socketRef.current;
    socket.emit('register', { username: user.username, color: user.color });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('users', (usersList: { username: string, color: string }[]) => {
      setConnectedUsers(usersList);
    });
    socket.on('notification', (notif: string) => {
      setNotifications((prev) => [...prev, notif]);
      setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 3000);
    });
    socket.on('typing', (username: string) => {
      setTypingUser(username);
      setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    });
    return () => {
      socket.off('message');
      socket.off('users');
      socket.off('notification');
      socket.off('typing');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  if (!user) return <div className="text-center text-white mt-10">Chargement...</div>;

  const handleSend = () => {
    if (!message.trim() || !user) return;

    if (socketRef.current) {
      socketRef.current.emit('message', {
        username: user.username,
        message,
        color: user.color,
      });
    }

    setMessage('');
  };

  return (
    <div className="flex h-[80vh] w-full max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Colonne utilisateurs */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Utilisateurs connectés</h3>
        <ul className="flex-1 overflow-y-auto">
          {connectedUsers.map((u, i) => (
            <li key={i} className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
              <span className="text-gray-200 font-medium">{u.username}</span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Zone de chat */}
      <main className="flex-1 flex flex-col">
        <header className="px-6 py-4 border-b border-gray-700 flex items-center justify-between bg-gray-900">
          <h2 className="text-xl font-bold text-blue-400">Bienvenue {user?.username}</h2>
          <div className="text-sm text-gray-400">Chat général</div>
        </header>
        {/* Messages */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto px-6 py-4 gap-2 bg-gray-900" style={{ display: 'flex', flexDirection: 'column-reverse' }}>
          {messages.slice().reverse().map((msg, i) => (
            <div key={i} className={`flex flex-col mb-2 ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.username === user?.username ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-100'}`}>
                <span className="font-semibold text-sm" style={{ color: msg.color || '#ffffff' }}>{msg.username}</span>
                <span className="text-xs text-gray-300 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="mt-1">{msg.message}</div>
              </div>
            </div>
          ))}
        </div>
        {/* is typing */}
        {typingUser && (
          <div className="px-6 pb-1 text-sm text-gray-400 italic">{typingUser} est en train d'écrire...</div>
        )}
        {/* Zone de saisie */}
        <form className="flex items-center gap-2 px-6 py-4 border-t border-gray-700 bg-gray-900" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (user && socketRef.current) socketRef.current.emit('typing', user.username);
            }}
            placeholder="Tapez votre message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition">Envoyer</button>
        </form>
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-blue-300 px-4 py-2 rounded shadow-lg text-sm transition-opacity duration-300 ease-in-out opacity-100">
            {notifications[notifications.length - 1]}
          </div>
        )}
      </main>
    </div>
  );
}
