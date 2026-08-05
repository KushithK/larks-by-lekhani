import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './pages/AuthPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserCatalog from './pages/UserCatalog';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import ReviewsPage from './pages/ReviewsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('larks_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('larks_user');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('larks_token');
    localStorage.removeItem('larks_user');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#faf6f5] text-[#2b2524]">
        <div>
          <Navbar currentUser={currentUser} onLogout={handleLogout} />
          <Routes>
            {/* PUBLIC STOREFRONT */}
            <Route path="/" element={<UserCatalog />} />
            
            {/* CUSTOMER SIGN IN & SIGN UP ONLY */}
            <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
            
            {/* SECRET PRIVATE ADMIN LOGIN (FOR LEKHANI ONLY) */}
            <Route path="/admin-login" element={<AdminLoginPage onLoginSuccess={handleLoginSuccess} />} />

            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/my-orders" element={<MyOrdersPage currentUser={currentUser} />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            
            {/* PROTECTED ADMIN ROUTE: Regular users are BLOCKED and redirected to '/' */}
            <Route
              path="/admin"
              element={
                currentUser && currentUser.role === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}