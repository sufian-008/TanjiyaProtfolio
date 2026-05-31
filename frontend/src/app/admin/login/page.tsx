'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setSubmitting(true);
    try {
      await login(username, password);
      showToast('Logged in successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Invalid admin credentials', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-6">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Security Gateway</h2>
          <h1 className="text-2xl font-extrabold text-black dark:text-white">Admin CMS Login</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Username</label>
            <div className="relative flex items-center border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark px-3 py-2.5">
              <User className="h-4 w-4 text-neutral-500 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-black dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center border border-border-light dark:border-border-dark rounded-lg bg-card-light dark:bg-card-dark px-3 py-2.5">
              <Lock className="h-4 w-4 text-neutral-500 mr-2 flex-shrink-0" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-black dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs sm:text-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40"
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-[10px] text-neutral-500 text-center uppercase tracking-wider">
          Tanjiya Nowrin Personal Brand CMS Panel
        </div>
      </div>
    </div>
  );
}
