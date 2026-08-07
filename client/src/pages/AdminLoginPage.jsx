import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

const HARDCODED_ADMIN_USERNAME = "lekhani_admin";
const HARDCODED_ADMIN_PASSWORD = "LarksStudio2026!";

export default function AdminLoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const inputUsername = adminUsername.trim();
    const inputPassword = adminPassword.trim();

    // INSTANT GUARANTEED UNLOCK (0.1s Verification)
    if (inputUsername === HARDCODED_ADMIN_USERNAME && inputPassword === HARDCODED_ADMIN_PASSWORD) {
      const adminUser = {
        name: 'Lekhani (Admin)',
        email: 'larksbylekhani@lbl.in',
        role: 'admin'
      };

      const token = 'admin_session_' + Date.now();
      localStorage.setItem('larks_token', token);
      localStorage.setItem('larks_user', JSON.stringify(adminUser));

      setSuccessPopup(true);

      // Instant Redirect to Admin Dashboard
      setTimeout(() => {
        onLoginSuccess(adminUser);
        navigate('/admin', { replace: true });
      }, 800);
    } else {
      setLoading(false);
      setErrorMsg('Invalid Admin Username or Password. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#b57c70]/30 shadow-2xl overflow-hidden space-y-6 p-8 relative">
        
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
          <p className="text-xs text-[#2b2524]/60">Authorized studio owner access only.</p>
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
            <span>{loading ? 'Unlocking Admin Portal...' : 'Unlock Admin Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#b57c70]" />
          </button>
        </form>

      </div>

      {/* UNLOCKED SUCCESS POPUP */}
      {successPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2b2524]">Admin Portal Unlocked!</h3>
            <p className="text-xs text-[#2b2524]/80">Welcome back, Lekhani! Opening your Admin Management Portal...</p>
            <div className="w-6 h-6 border-2 border-[#b57c70] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}