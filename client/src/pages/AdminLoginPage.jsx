import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('larks_token', data.token);
        localStorage.setItem('larks_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.message || 'Invalid admin username or password.');
      }
    } catch (err) {
      setErrorMsg('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#b57c70]/30 shadow-2xl overflow-hidden space-y-6 p-8">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#2b2524] text-[#b57c70] rounded-full flex items-center justify-center mx-auto mb-2 shadow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase font-bold text-[#b57c70] tracking-widest bg-[#f5ebe8] px-3 py-1 rounded">
            Private Studio Control
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2b2524]">
            Lekhani Studio Admin Login
          </h1>
          <p className="text-xs text-[#2b2524]/60">Authorized owner access only.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2b2524] mb-1">Admin Username</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 absolute left-3 top-3 text-[#2b2524]/40" />
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="lekhani_admin"
                className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2b2524] mb-1">Admin Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#2b2524]/40" />
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2b2524] hover:bg-[#423b3a] text-white font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow"
          >
            <span>{loading ? 'Authenticating...' : 'Unlock Admin Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#b57c70]" />
          </button>
        </form>

      </div>
    </div>
  );
}