import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, Info, ShoppingBag, LayoutDashboard, UserCheck, HelpCircle, Star, Mail, Package, LogIn } from 'lucide-react';

export default function Navbar({ currentUser, onLogout }) {
  const location = useLocation();
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-[#faf6f5]/95 backdrop-blur-md border-b border-[#b57c70]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#b57c70] text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold text-[#2b2524] block leading-none">
              Larks by Lekhani
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#b57c70] font-medium block mt-1">
              Handcrafted Studio
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 text-xs font-semibold">
          
          {/* COLLECTIONS LINK (SHOWS FOR EVERYONE, INCLUDING ADMIN) */}
          <Link
            to="/"
            className={`flex items-center gap-1 transition-colors ${
              location.pathname === '/' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Collections
          </Link>

          {/* CUSTOMER LINKS: COMPLETELY REMOVED FOR ADMIN */}
          {!isAdmin && (
            <>
              {currentUser && (
                <Link
                  to="/my-orders"
                  className={`flex items-center gap-1 transition-colors ${
                    location.pathname === '/my-orders' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 text-[#b57c70]" /> My Orders
                </Link>
              )}

              <Link
                to="/about"
                className={`flex items-center gap-1 transition-colors ${
                  location.pathname === '/about' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
                }`}
              >
                <Info className="w-3.5 h-3.5" /> About Us
              </Link>

              <Link
                to="/reviews"
                className={`flex items-center gap-1 transition-colors ${
                  location.pathname === '/reviews' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500" /> Reviews
              </Link>

              <Link
                to="/faqs"
                className={`flex items-center gap-1 transition-colors ${
                  location.pathname === '/faqs' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> FAQs
              </Link>

              <Link
                to="/contact"
                className={`flex items-center gap-1 transition-colors ${
                  location.pathname === '/contact' ? 'text-[#b57c70] font-bold border-b-2 border-[#b57c70] pb-0.5' : 'text-[#2b2524] hover:text-[#b57c70]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Contact Us
              </Link>
            </>
          )}

          {/* ADMIN PORTAL BUTTON (SHOWN ONLY FOR ADMIN) */}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-3.5 py-1.5 rounded-full text-white flex items-center gap-1.5 transition-all shadow-sm ${
                location.pathname === '/admin' ? 'bg-[#b57c70]' : 'bg-[#2b2524] hover:bg-[#423b3a]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#b57c70]" /> Admin Portal
            </Link>
          )}

          {/* USER / ADMIN STATUS BADGE & LOGOUT */}
          {currentUser ? (
            <div className="flex items-center gap-3 pl-3 border-l border-[#b57c70]/20">
              <span className="flex items-center gap-1 text-[#2b2524]/80 bg-[#f5ebe8] px-2.5 py-1 rounded">
                <UserCheck className="w-3.5 h-3.5 text-[#b57c70]" />
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1.5 text-rose-700 hover:bg-rose-100 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-[#b57c70] hover:bg-[#9e675b] text-white flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}