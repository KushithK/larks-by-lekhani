import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Sparkles, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('user-login'); // 'user-login' | 'user-register'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Pop-up Success State
  const [showLoginSuccessPopup, setShowLoginSuccessPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. SIGN UP (REGISTER)
  const handleUserRegister = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg(''); setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Account created successfully! You can now Sign In below.');
        setAuthMode('user-login');
      } else {
        setErrorMsg(data.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // 2. SIGN IN (WITH POP-UP ALERT & DIRECT REDIRECT TO HOME PAGE)
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg(''); setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('larks_token', data.token);
        localStorage.setItem('larks_user', JSON.stringify(data.user));
        
        setLoggedInUser(data.user);
        setShowLoginSuccessPopup(true); // SHOW POPUP ALERT

        // Auto-redirect directly to Home Page after 1.2 seconds
        setTimeout(() => {
          onLoginSuccess(data.user);
          navigate('/');
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Invalid user email or password.');
      }
    } catch (err) {
      setErrorMsg('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#b57c70]/20 shadow-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#2b2524] text-[#faf6f5] p-8 text-center relative">
          <div className="w-12 h-12 bg-[#b57c70] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold">Larks by Lekhani</h1>
          <p className="text-xs text-[#faf6f5]/70 mt-1">Artisanal Custom Handcrafted Gift & Jewelry Studio</p>
        </div>

        {/* Customer Mode Tabs */}
        <div className="flex border-b border-[#b57c70]/20 bg-[#faf6f5]">
          <button
            onClick={() => { setAuthMode('user-login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              authMode === 'user-login' ? 'bg-white text-[#b57c70] border-b-2 border-[#b57c70]' : 'text-[#2b2524]/60 hover:text-[#2b2524]'
            }`}
          >
            User Sign In
          </button>
          <button
            onClick={() => { setAuthMode('user-register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              authMode === 'user-register' ? 'bg-white text-[#b57c70] border-b-2 border-[#b57c70]' : 'text-[#2b2524]/60 hover:text-[#2b2524]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded border border-rose-200">{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded border border-emerald-200">{successMsg}</div>}

          {/* USER LOGIN FORM */}
          {authMode === 'user-login' && (
            <form onSubmit={handleUserLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#2b2524]/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. customer@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#2b2524]/40" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#b57c70] hover:bg-[#9e675b] text-white font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Store'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* USER REGISTER FORM */}
          {authMode === 'user-register' && (
            <form onSubmit={handleUserRegister} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-[#2b2524]/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#2b2524]/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="customer@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#2b2524] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-[#2b2524]/40" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                    className="w-full pl-9 pr-3 py-2.5 rounded border border-[#2b2524]/20 bg-[#faf6f5] focus:outline-none focus:border-[#b57c70]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2b2524] hover:bg-[#423b3a] text-white font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 shadow"
              >
                <UserPlus className="w-4 h-4 text-[#b57c70]" />
                <span>Create Customer Account</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* SUCCESSFUL SIGN-IN POPUP MODAL */}
      {showLoginSuccessPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-[#b57c70]/30 animate-in fade-in zoom-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#2b2524]">Successfully Signed In!</h3>
            <p className="text-xs text-[#2b2524]/80 leading-relaxed font-medium">
              Welcome back, <strong className="text-[#b57c70]">{loggedInUser?.name}</strong>! Redirecting you directly to the storefront...
            </p>

            <div className="pt-2">
              <div className="w-6 h-6 border-2 border-[#b57c70] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}